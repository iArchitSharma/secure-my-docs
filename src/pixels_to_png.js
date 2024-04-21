import fs from "fs";
import { createCanvas, ImageData as CanvasImageData } from "canvas";

export function pixelstoPNG() {
    function removeBin(){
        return new Promise((resolve, reject) => {
            fs.unlink("../../data_volume/input_file.bin", (err) => {
                if(err){
                    reject(err);
                    return;
                }
            });
            resolve();
        });
    }
    return new Promise((resolve, reject) => {
        // Function to read width and height from the binary data
        function readPageDimensions(binaryData, offset) {
            const width = binaryData.readUInt32LE(offset);
            const height = binaryData.readUInt32LE(offset + 4);
            return { width, height };
        }

        // Function to reconstruct pixel data array from concatenated Buffer
        function reconstructPixelData(concatenatedData) {
            const bytesPerPage = 8; // Each page data includes 4 bytes for width and 4 bytes for height
            const pixelsData = [];
            let offset = 0;

            while (offset < concatenatedData.length) {
                const { width, height } = readPageDimensions(concatenatedData, offset);
                offset += 8; // Move offset after reading width and height
                const pageData = concatenatedData.slice(offset, offset + width * height * 4);
                pixelsData.push({ width, height, data: pageData });
                offset += width * height * 4; // Move offset to the next page
            }

            return pixelsData;
        }

        // Function to convert pixel data into image and save it as PNG
        async function saveImagesFromPixelData(pixelDataArray, outputFolder) {
            for (let i = 0; i < pixelDataArray.length; i++) {
                const { width, height, data } = pixelDataArray[i];
                const pageCanvas = createCanvas(width, height);
                const pageContext = pageCanvas.getContext("2d");
                const imageData = new CanvasImageData(new Uint8ClampedArray(data), width, height);
                pageContext.putImageData(imageData, 0, 0);

                const out = fs.createWriteStream(`${outputFolder}/page_${i + 1}.png`);
                const stream = pageCanvas.createPNGStream();
                stream.pipe(out);

                await new Promise((resolve, reject) => {
                    out.on("finish", resolve);
                    out.on("error", reject);
                });
            }
        }

        // Read concatenated pixel data from binary file
        const concatenatedData = fs.readFileSync("../../data_volume/input_file.bin");

        // Reconstruct pixel data array
        const pixelDataArray = reconstructPixelData(concatenatedData);

        // Define output folder (change this to your desired folder)
        const outputFolder = "../tmp/output_images";

        // Create output folder if it doesn't exist
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder);
        }

        // Save images from pixel data
        saveImagesFromPixelData(pixelDataArray, outputFolder)
            .then(() => {
                console.log("Images saved successfully.");
                resolve(); // Resolve the outer promise if saving images is successful
                removeBin();
            })
            .catch(error => {
                console.error("Error saving images:", error);
                reject(error); // Reject the outer promise if there's an error
            });
    });
}
