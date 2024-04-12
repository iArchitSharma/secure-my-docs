import officeToPdf from "office-to-pdf";
import fs from "fs";

export function toPdf(inputFile){
 var wordBuffer = fs.readFileSync("../tenor.gif")
  
  officeToPdf(wordBuffer).then(
    (pdfBuffer) => {
      fs.writeFileSync("../tmp/test.pdf", pdfBuffer)
    }, (err) => {
      console.log(err)
    }
  )
}