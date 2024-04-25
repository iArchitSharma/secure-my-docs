// import { startContainer } from "../container/index.js";

let selectedFile = null;

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("file-input");
  const submitButton = document.getElementById("submit-button");

  fileInput.addEventListener("change", (event) => {
    const files = event.target.files;
    if (files.length === 1) {
      selectedFile = files[0];
    } else {
      console.error("Please select only one file.");
    }
  });

  const handleSubmit = () => {
    if (selectedFile) {
      const fileLocation = `${selectedFile.path}`;
      const fileName = `${selectedFile.name}`;
      const saveLocation = "C:\\Users\\archi\\Downloads\\";

      console.log(`File location: ${fileLocation}`);
      startContainer(fileLocation, fileName, saveLocation); // Calling the imported function
    } else {
      console.log("No file selected.");
    }
  };

  submitButton.addEventListener("click", handleSubmit);
});
