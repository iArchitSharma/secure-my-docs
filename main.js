import { app, BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('src/ui/index.html')
}

app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  ipcMain.on('save-file', (event, file) => {
    const filePath = path.join(app.getPath('documents'), file.name);
    fs.writeFileSync(filePath, file.data); 
    console.log(`File saved to ${filePath}`);
  });