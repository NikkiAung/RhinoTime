import { app, BrowserWindow,ipcMain, shell } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url';
import cron from 'node-cron'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  // In development, load from the Vite dev server
  if (process.env.NODE_ENV === 'DEV') {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    // In production, load the built files
    mainWindow.loadFile('dist/index.html')
  }

  // Open DevTools in development
  if (process.env.NODE_ENV === 'DEV') {
    mainWindow.webContents.openDevTools()
  }
}

app.whenReady().then(() => {
  createWindow()
  
  ipcMain.on('schedule-zoom', (event, timeSheet, zoomLink) => {
    console.log("Scheduling Zoom:", timeSheet);
    shell.openExternal(zoomLink); // ✅ Safe operation
  });

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