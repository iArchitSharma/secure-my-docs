import {exec} from'child_process';

const fileLocation = "F:\\projects\\existing.xlsx";
const saveLocation = "C:\\Users\\archi\\Downloads\\";

// Split the string by backslashes and get the last element
const segments = fileLocation.split("\\");
const fileName = segments[segments.length - 1];

exec("docker images | grep -w sec-docs", (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  if (stdout.trim() !== '') {
    console.log('Image exists');
     runContainer();
  } else {
    console.log('Image does not exist');
     buildImage();
  }
});

// Build Docker Image
function buildImage(){
  exec('docker build -t sec-docs ../../', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    runContainer();
  });
}

// Run the Container
function runContainer() {
    exec(`docker run --network none -d --name my-sec-docs -v data_volume:/data_volume -e FILE_PATH="/data_volume/${fileName}" sec-docs`, (error2, stdout2, stderr2) => {
      if (error2) {
        console.error(`Error running container: ${error2.message}`);
        return;
      }
      if (stderr2) {
        console.error(`Error running container: ${stderr2}`);
        return;
      }
      console.log(`Container started successfully: ${stdout2}`);
      // Step2
      exec(`docker cp ${fileLocation} my-sec-docs:/data_volume/`, (error2, stdout2, stderr2) => {
        if (error2) {
          console.error(`Error copying the Document: ${error2.message}`);
          return;
        }
        if (stderr2) {
          console.error(`Error copying the Document: ${stderr2}`);
          return;
        }
        console.log(`Document copyed successfully: ${stdout2}`);
        saveFile();
      });
    });
}

function saveFile(){
  exec(`docker cp my-sec-docs:/data_volume/safe_output.pdf ${saveLocation}`, (error2, stdout2, stderr2) => {
    if (error2) {
      console.error(`Error saving safe_output.pdf: ${error2.message}`);
      return;
    }
    if (stderr2) {
      console.error(`Error saving safe_output.pdf: ${stderr2}`);
      return;
    }
    console.log(`File saved successfully: ${stdout2}`);
});
}