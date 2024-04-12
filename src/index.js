import {pdftoPixels} from "./pdf_to_pixels.js";
import { pixelstoPNG } from "./pixels_to_png.js";
import { pngtoPDF } from "./png_to_pdf.js"

const pdfLocation = "../xyz.pdf";
const outputDir = "../tmp/safe_output.pdf";

async function main() {
  try {
    await pdftoPixels(pdfLocation);
    console.log("Step 1: PDF converted to pixels successfully.");

    await pixelstoPNG();
    console.log("Step 2: Pixels converted to PNG successfully.");

    await pngtoPDF(outputDir);
    console.log("Step 3: PNG converted to PDF successfully.");
    
  } catch (error) {
    console.log("Error", error);
  }
}

main();