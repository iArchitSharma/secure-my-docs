import { pixelstoPNG } from "./pixels_to_png.js";
import { pngtoPDF } from "./png_to_pdf.js"

const outputDir = "../tmp/safe_output.pdf";

async function main() {
  try {
    await pixelstoPNG();
    console.log("Step 2: Pixels converted to PNG successfully.");

    await pngtoPDF(outputDir);
    console.log("Step 3: PNG converted to PDF successfully.");
    
  } catch (error) {
    console.log("Error", error);
  }
}

main();