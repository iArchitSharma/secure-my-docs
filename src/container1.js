import { toPdf } from "./doc_to_pdf.js";
import { pdftoPixels } from "./pdf_to_pixels.js";
import path from "path";

async function main() {
  try {
    // Get the file location from command-line arguments
    const fileLocation = process.argv[2]; // Assuming the file location is passed as the third argument

    if (!fileLocation) {
      console.error("Error: File location not provided.");
      return;
    }

    const fileExtension = getFileExtension(fileLocation);

    if (fileExtension !== ".pdf") {
      // Convert non-PDF files to PDF
      console.log("Converting non-PDF file to PDF...");
      await toPdf(fileLocation);
      console.log("PDF file generated successfully!");
    }

    // Now proceed with converting PDF to pixels
    await pdftoPixels(fileExtension === ".pdf" ? fileLocation : "../tmp/convertedPdf.pdf");
    console.log("Step 1: PDF converted to pixels successfully.");
  } catch (error) {
    console.error("Error", error);
  }
}

main();

function getFileExtension(fileLocation) {
  return path.extname(fileLocation).toLowerCase();
}
