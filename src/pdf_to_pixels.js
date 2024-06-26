import { strict as assert } from "assert";
import Canvas from "canvas";
import fs from "fs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

class NodeCanvasFactory {
  create(width, height) {
    assert(width > 0 && height > 0, "Invalid canvas size");
    const canvas = Canvas.createCanvas(width, height);
    const context = canvas.getContext("2d");
    return {
      canvas,
      context,
    };
  }

  reset(canvasAndContext, width, height) {
    assert(canvasAndContext.canvas, "Canvas is not specified");
    assert(width > 0 && height > 0, "Invalid canvas size");
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext) {
    assert(canvasAndContext.canvas, "Canvas is not specified");

    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

async function removeConvertedPdf() {
  try {
    await fs.promises.unlink("../tmp/convertedPdf.pdf");
    console.log("Converted PDF removed successfully.");
  } catch (error) {
    console.error("Error removing converted PDF:", error);
  }
}

export async function pdftoPixels(pdfLocation, outputFile) {
  const canvasFactory = new NodeCanvasFactory();

  try {
    const data = new Uint8Array(fs.readFileSync(pdfLocation));
    const pagesInfo = [];
    const pixelsData = [];

    const loadingTask = getDocument({
      data,
      canvasFactory,
    });
    const pdfDocument = await loadingTask.promise;
    console.log("# PDF document loaded.");

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const viewport = page.getViewport({ scale: 1.0 });
      const canvasAndContext = canvasFactory.create(
        viewport.width,
        viewport.height
      );
      const renderContext = {
        canvasContext: canvasAndContext.context,
        viewport,
      };

      const renderTask = page.render(renderContext);
      await renderTask.promise;

      const imageData = canvasAndContext.context.getImageData(
        0,
        0,
        canvasAndContext.canvas.width,
        canvasAndContext.canvas.height
      );
      const pixels = new Uint8ClampedArray(imageData.data);
      pixelsData.push(pixels);
      pagesInfo.push({
        width: canvasAndContext.canvas.width,
        height: canvasAndContext.canvas.height,
      });

      page.cleanup();
    }

    // Construct binary data with width, height, and pixel data for each page
    const concatenatedData = Buffer.concat(
      pagesInfo.map((page) => {
        const widthBuffer = Buffer.alloc(4);
        widthBuffer.writeUInt32LE(page.width, 0);
        const heightBuffer = Buffer.alloc(4);
        heightBuffer.writeUInt32LE(page.height, 0);
        const pixelData = pixelsData.shift();
        return Buffer.concat([
          widthBuffer,
          heightBuffer,
          Buffer.from(pixelData.buffer),
        ]);
      })
    );

    await fs.promises.writeFile(outputFile, concatenatedData);
    //Remove convertedPdf if it exists
    if (fs.existsSync("../tmp/convertedPdf.pdf")) {
      await removeConvertedPdf();
    }
    console.log("Pixel data saved to a single binary file:", outputFile);
  } catch (error) {
    console.error("Error converting PDF to pixels:", error);
  }
}
