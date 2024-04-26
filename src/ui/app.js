const { ipcRenderer } = require('electron');

const fileInput = document.getElementById('file-input');
let selectedFile = null;
let selectedDirectory = null;

fileInput.addEventListener('change', (event) => {
  const files = event.target.files;
  if (files.length === 1) {
    selectedFile = files[0];
    console.log(`Selected file: ${selectedFile.name}`);
  } else {
    console.error('Please select only one file.');
  }
});

const directoryLabel = document.getElementById('selected-directory');

document.getElementById('select-directory').addEventListener('click', () => {
  ipcRenderer.send('select-directory');
});

ipcRenderer.on('directory-selected', (event, directory) => {
  selectedDirectory = directory;
  directoryLabel.textContent = `Selected directory: ${directory}`;
});

const handleSubmit = () => {
  if (selectedFile && selectedDirectory) {
    const floc = `${selectedFile.path}`;
    const fname = `${selectedFile.name}`;
    console.log(`File location: ${floc}`); 
    console.log(`Directory location: ${selectedDirectory}`); 
    ipcRenderer.send('trigger-container', floc, fname, selectedDirectory);
  } else {
    console.log('No file or directory selected.');
  }
};

const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', handleSubmit);
