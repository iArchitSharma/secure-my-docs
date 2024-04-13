import officeToPdf from "office-to-pdf";
import fs from "fs";

export function toPdf(inputFile) {
  return new Promise((resolve, reject) => {
    // Read the Office file as a buffer
    fs.readFile(inputFile, (err, officeBuffer) => {
      if (err) {
        console.error("Error reading input file:", err);
        reject(err);
        return;
      }

      // Convert the Office buffer to PDF
      officeToPdf(officeBuffer).then(
        (pdfBuffer) => {
          // Write the PDF buffer to a file
          fs.writeFile("../tmp/convertedPdf.pdf", pdfBuffer, (err) => {
            if (err) {
              console.error("Error writing PDF file:", err);
              reject(err);
              return;
            }
            console.log("PDF file generated successfully!");
            resolve();
          });
        },
        (err) => {
          console.error("Error converting to PDF:", err);
          reject(err);
        }
      );
    });
  });
}


