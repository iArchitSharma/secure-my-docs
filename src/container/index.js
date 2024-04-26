import { exec } from "child_process";

// Helper function to execute a command and return a Promise
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
      } else if (stderr) {
        reject(`stderr: ${stderr}`);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

// const fileLocation = "C:\\Users\\archi\\Downloads\\";
// const saveLocation = "C:\\Users\\archi\\Downloads\\";
// const segments = fileLocation.split("\\");
// const fileName = segments[segments.length - 1];

export async function runSequence(fileLocation,fileName,saveLocation) {
  try {
    // Step 1: Check if the image exists
    const imageCheck = await execPromise("docker images | grep -w sec-docs");
    console.log("Image exists");

    // Step 2: Build image if it doesn't exist
    if (imageCheck === "") {
      console.log("Image does not exist");
      await execPromise("docker build -t sec-docs ../../");
    }

    // Step 3: Run the container
    const runOutput = await execPromise(
      `docker run --network none -d --name my-sec-docs -v data_volume:/data_volume -e FILE_PATH="/data_volume/${fileName}" sec-docs`
    );
    console.log(`Container started successfully: ${runOutput}`);

    // Step 4: Copy the file to the container
    const copyOutput = await execPromise(
      `docker cp ${fileLocation} my-sec-docs:/data_volume/`
    );
    console.log(`Document copied successfully: ${copyOutput}`);

    // Step 5: Save the file from the container
    const saveOutput = await execPromise(
      `docker cp my-sec-docs:/data_volume/safe_output.pdf ${saveLocation}`
    );
    console.log(`File saved successfully: ${saveOutput}`);

    // Step 6: **Stop** and then remove the container
    const stopOutput = await execPromise(`docker stop my-sec-docs`);
    console.log(`Container stopped successfully: ${stopOutput}`);

    const removeOutput = await execPromise(`docker rm my-sec-docs`);
    console.log(`Container removed successfully: ${removeOutput}`);
  } catch (error) {
    console.error(`Operation failed: ${error}`);
  }
}

//  runSequence();
