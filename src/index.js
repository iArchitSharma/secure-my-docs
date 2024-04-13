import { toPdf } from "./doc_to_pdf.js";
import {pdftoPixels} from "./pdf_to_pixels.js";
import { pixelstoPNG } from "./pixels_to_png.js";
import { pngtoPDF } from "./png_to_pdf.js"
import path from "path";

const pdfLocation = "../tester.docx";
const outputDir = "../tmp/safe_output.pdf";

async function main() {
  try {
    if(getFileExtension(pdfLocation)!==".pdf"){
      await toPdf(pdfLocation);
      await pdftoPixels("../tmp/convertedPdf.pdf");
      console.log("Step 1: PDF converted to pixels successfully.");
    }else{
      await pdftoPixels(pdfLocation);
      console.log("Step 1: PDF converted to pixels successfully.");
    }

    await pixelstoPNG();
    console.log("Step 2: Pixels converted to PNG successfully.");

    await pngtoPDF(outputDir);
    console.log("Step 3: PNG converted to PDF successfully.");
    
  } catch (error) {
    console.log("Error", error);
  }
}

main();

function getFileExtension(pdfLocation){
  return path.extname(pdfLocation).toLowerCase();
}