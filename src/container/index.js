import {exec} from'child_process';

exec("docker images | grep -w sec-doc", (error, stdout, stderr) => {
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
    // buildImage();
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
  // Create a Docker network with no external connectivity
  exec('docker network create --driver=none no-internet', (error1, stdout1, stderr1) => {
    if (error1) {
      console.error(`Error creating network: ${error1.message}`);
      return;
    }
    if (stderr1) {
      console.error(`Error creating network: ${stderr1}`);
      return;
    }

    // Run the container and connect it to the no-internet network
    exec('docker run --rm --network=no-internet --name=my-container -d sec-docs', (error2, stdout2, stderr2) => {
      if (error2) {
        console.error(`Error running container: ${error2.message}`);
        return;
      }
      if (stderr2) {
        console.error(`Error running container: ${stderr2}`);
        return;
      }
      console.log(`Container started successfully: ${stdout2}`);
    });
  });
}