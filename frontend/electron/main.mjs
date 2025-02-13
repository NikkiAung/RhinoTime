import { app, BrowserWindow } from 'electron'
import path from 'path'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
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
