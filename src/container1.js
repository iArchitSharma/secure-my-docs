import { toPdf } from "./doc_to_pdf.js";
import { pdftoPixels } from "./pdf_to_pixels.js";
import path from "path";

async function main() {
  try {
    let fileLocation = process.argv[2];
    const outputFile = "../../data_volume/input_file.bin";

    //if file location not provided via command line arguments, use environment variable
    if (!fileLocation && process.env.FILE_LOCATION) {
      fileLocation = process.env.FILE_LOCATION;
    } else if (!fileLocation) {
      console.error("Error: File location not provided.");
      return;
    }

    const fileExtension = getFileExtension(fileLocation);

    if (fileExtension !== ".pdf") {
      console.log("Converting non-PDF file to PDF...");
      await toPdf(fileLocation);
      console.log("PDF file generated successfully!");
    }

    await pdftoPixels(fileExtension === ".pdf" ? fileLocation : "../tmp/convertedPdf.pdf", outputFile);
    console.log("Step 1: PDF converted to pixels successfully.");
  } catch (error) {
    console.error("Error", error);
  }
}

main();

function getFileExtension(fileLocation) {
  return path.extname(fileLocation).toLowerCase();
}
