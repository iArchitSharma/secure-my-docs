import PDFDocument from "pdfkit";
import fs from "fs";
import { error } from "console";

//delete all files in dir
function deleteFiles(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      files.forEach((file) => {
        const filePath = `${dir}/${file}`;
        fs.unlink(filePath, (err) => {
          if (err) {
            reject(err);
            return;
          }
        });
      });
      resolve();
    });
  });
}

//convert images to pdf
function convert(inputDir, outputDir) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const imageFiles = fs.readdirSync(inputDir).sort((a, b) => {
      return parseInt(a.split("_")[1]) - parseInt(b.split("_")[1]);
    });

    if (imageFiles.length === 0) {
        console.log("No images found in the input directory.");
        resolve(); // Resolve without creating PDF
        return;
    }

    imageFiles.forEach((imageFile, index) => {
      const imagePath = `${inputDir}/${imageFile}`;
      if (fs.existsSync(imagePath)) {
        if (index !== 0) {
          doc.addPage();
        }
        // Calculate image size based on the page width and height
        const imgWidth = doc.page.width - 2 * doc.page.margins.left;
        const imgHeight = doc.page.height - 2 * doc.page.margins.top;

        // Calculate center position
        const centerX = (doc.page.width - imgWidth) / 2;
        const centerY = (doc.page.height - imgHeight) / 2;

        doc.image(imagePath, {
            // Set position at the calculated center
            x: centerX,
            y: centerY,
            width: imgWidth,
            height: imgHeight,
        });
      } else {
        reject(new Error(`Image file ${imagePath} not found`));
      }
    });

    const outputStream = fs.createWriteStream(outputDir);
    doc.pipe(outputStream);
    doc.end();

    outputStream.on("finish", () => {
      deleteFiles(inputDir)
        .then(() => resolve())
        .catch((err) => reject(err));
    });

    outputStream.on("error", () => {
      reject(error);
    });
  });
}

const inputDir = "../tmp/output_images";

export function pngtoPDF(outputDir) {
  return new Promise((resolve, reject) => {
      convert(inputDir, outputDir)
          .then(() => {
              console.log("PDF created successfully.");
              resolve();
          })
          .catch((error) => {
              console.error("Error creating PDF:", error);
              reject(error);
          });
  });
}