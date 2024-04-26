import { toPdf } from "./doc_to_pdf.js";
import { pdftoPixels } from "./pdf_to_pixels.js";
import { pixelstoPNG } from "./pixels_to_png.js";
import { pngtoPDF } from "./png_to_pdf.js";
import path from "path";

async function main() {
  try {
    let fileLocation = process.argv[2];  
    const outputFile = "../../data_volume/input_file.bin";  
    const outputDir = "../../data_volume/safe_output.pdf";  

    // Fallback to environment variable if needed
    if (!fileLocation && process.env.FILE_LOCATION) {
      fileLocation = process.env.FILE_LOCATION;
    } else if (!fileLocation) {
      console.error("Error: File location not provided."); 
      return;
    }

    const fileExtension = getFileExtension(fileLocation); 

    // Convert non-PDF to PDF if needed
    if (fileExtension !== ".pdf") {
      console.log("Converting non-PDF file to PDF...");
      await toPdf(fileLocation); 
      console.log("PDF file generated successfully!");
    }

    // Convert PDF to pixels and ensure completion
    await pdftoPixels(
      fileExtension === ".pdf" ? fileLocation : "../tmp/convertedPdf.pdf",
      outputFile
    );
    console.log("Step 1: PDF converted to pixels successfully.");

    // Convert pixels to PNG
    await pixelstoPNG();  
    console.log("Step 2: Pixels converted to PNG successfully.");

    // Convert PNG to PDF
    await pngtoPDF(outputDir);  
    console.log("Step 3: PNG converted to PDF successfully.");
  } catch (error) {
    console.error("Error", error); 
  }
}

main();  

function getFileExtension(fileLocation) {
  return path.extname(fileLocation).toLowerCase();
}
