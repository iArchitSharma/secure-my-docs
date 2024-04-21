// import { toPdf } from "./doc_to_pdf.js";
// import {pdftoPixels} from "./pdf_to_pixels.js";
// import { pixelstoPNG } from "./pixels_to_png.js";
// import { pngtoPDF } from "./png_to_pdf.js"
// import path from "path";

// const pdfLocation = "../styler.xlsx";
// const outputDir = "../tmp/safe_output.pdf";

// async function main() {
//   try {
//     if(getFileExtension(pdfLocation)!==".pdf"){
//       await toPdf(pdfLocation);
//       await pdftoPixels("../tmp/convertedPdf.pdf");
//       console.log("Step 1: PDF converted to pixels successfully.");
//     }else{
//       await pdftoPixels(pdfLocation);
//       console.log("Step 1: PDF converted to pixels successfully.");
//     }

//     await pixelstoPNG();
//     console.log("Step 2: Pixels converted to PNG successfully.");

//     await pngtoPDF(outputDir);
//     console.log("Step 3: PNG converted to PDF successfully.");

//   } catch (error) {
//     console.log("Error", error);
//   }
// }

// main();

// function getFileExtension(pdfLocation){
//   return path.extname(pdfLocation).toLowerCase();
// }

import { toPdf } from "./doc_to_pdf.js";
import { pdftoPixels } from "./pdf_to_pixels.js";
import { pixelstoPNG } from "./pixels_to_png.js";
import { pngtoPDF } from "./png_to_pdf.js";
import path from "path";

async function main() {
  try {
    let fileLocation = process.argv[2];  // Get file location from command line
    const outputFile = "../../data_volume/input_file.bin";  // Output file for pixel data
    const outputDir = "../../data_volume/safe_output.pdf";  // Final output PDF location

    // Fallback to environment variable if needed
    if (!fileLocation && process.env.FILE_LOCATION) {
      fileLocation = process.env.FILE_LOCATION;
    } else if (!fileLocation) {
      console.error("Error: File location not provided."); // Error handling for missing file
      return;
    }

    const fileExtension = getFileExtension(fileLocation); // Get file extension

    // Convert non-PDF to PDF if needed
    if (fileExtension !== ".pdf") {
      console.log("Converting non-PDF file to PDF...");
      await toPdf(fileLocation);  // Ensure this operation completes
      console.log("PDF file generated successfully!");
    }

    // Convert PDF to pixels and ensure completion
    await pdftoPixels(
      fileExtension === ".pdf" ? fileLocation : "../tmp/convertedPdf.pdf",
      outputFile
    );
    console.log("Step 1: PDF converted to pixels successfully.");

    // Convert pixels to PNG
    await pixelstoPNG();  // This should only run after pdftoPixels completes
    console.log("Step 2: Pixels converted to PNG successfully.");

    // Convert PNG to PDF
    await pngtoPDF(outputDir);  // This should only run after pixelstoPNG completes
    console.log("Step 3: PNG converted to PDF successfully.");
  } catch (error) {
    console.error("Error", error);  // Error handling for any issue in the process
  }
}

main();  // Start the process

function getFileExtension(fileLocation) {
  return path.extname(fileLocation).toLowerCase();  // Utility to get the file extension
}
