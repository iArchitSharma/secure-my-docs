import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { runSequence } from "./src/container/index.js";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("src/ui/index.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Handle IPC event for selecting a directory
ipcMain.on("select-directory", async (event) => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });

  if (filePaths && filePaths.length > 0) {
    event.sender.send("directory-selected", filePaths[0]);
  } else {
    event.sender.send("directory-selected", null);
  }
});

ipcMain.on("trigger-container", (event, floc, fname, sloc) => {
  runSequence(floc, fname, sloc); 
});
