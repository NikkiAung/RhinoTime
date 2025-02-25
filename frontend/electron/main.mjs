import { app, BrowserWindow,ipcMain, shell } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url';
import cron from 'node-cron'
import { exec } from 'child_process';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon : process.platform === 'darwin' 
      ? path.join(__dirname, 'build/icons/mac/icon.icns') 
      : path.join(__dirname, 'build/icons/win/icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true, 
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  mainWindow.webContents.on('did-finish-load', () => {
    if (process.env.NODE_ENV !== 'DEV') {
      autoUpdater.checkForUpdates();
      showMessage(`Checking for updates. Current Version is ${app.getVersion()}`);
    }
  });

  // In development, load from the Vite dev server
  if (process.env.NODE_ENV === 'DEV') {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Open DevTools in development cmd+opt+I
  if (process.env.NODE_ENV === 'DEV') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

}

// Function to convert days to cron format (Sunday = 0, Monday = 1, etc.)
function getCronDay(day) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days.indexOf(day);
}

// Function to Close Zoom
function closeZoom() {
  console.log("Attempting to close Zoom...");
  if (process.platform === "win32") {
    exec("taskkill /F /IM Zoom.exe", (error, stdout, stderr) => {
      if (error) {
          console.error("Error closing Zoom:", stderr);
      } else {
          console.log("Zoom closed successfully.");
      }
    });
  } else {
    console.log('closing from macOS')
    exec("pkill zoom", (error, stdout, stderr) => {
      if (error) {
          console.error("Error closing Zoom:", stderr);
      } else {
          console.log("Zoom closed successfully.");
      }
  });
  }
}

//func to show message
function showMessage(message) {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('updateMessage', message);
  }
}

/* New Update Available */
autoUpdater.on("update-available", (info) => {
  showMessage(`Update available. Current Version is ${app.getVersion()}`);
  autoUpdater.downloadUpdate();
});

autoUpdater.on("update-not-available", (info) => {
  showMessage(`No update available. Current Version is ${app.getVersion()}`);
});

autoUpdater.on("update-downloaded", () => {
  showMessage(`Update downloaded. Current Version is ${app.getVersion()}`);
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 3000);
});

autoUpdater.on("download-progress", (progressObj) => {
  showMessage(`Downloading update ${Math.round(progressObj.percent)}%`);
});

/* Error Handling */
autoUpdater.on("error", (info) => {
  showMessage(`Error: ${info}`);
});

app.whenReady().then(() => {
  createWindow()

  ipcMain.on('schedule-zoom', (event, timeSheet, overtimeData) => {
    try {
      // mainTime cron
      for (const [day, { startTime, endTime, meetingLink }] of Object.entries(timeSheet)) {
        if(startTime === '00:00' && endTime === '00:00') {
          continue;
        }
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);
  
        cron.schedule(`${startMinute} ${startHour} * * ${getCronDay(day)}`, () => {
          console.log(`Starting Zoom Meeting for ${day} at ${startTime}`);
          console.log(meetingLink)
          if (meetingLink && meetingLink.startsWith('http')) {
            shell.openExternal(meetingLink);
          }
        });
  
        cron.schedule(`${endMinute} ${endHour} * * ${getCronDay(day)}`, () => {
          console.log(`Closing Zoom Meeting for ${day} at ${endTime}`);
          closeZoom();
        });
      }
      // overTime cron
      for (const [day, overtimeEntries] of Object.entries(overtimeData)) {
        overtimeEntries.forEach(({ date, startTime, endTime, meetingLink}) => {
          const [startHour, startMinute] = startTime.split(":").map(Number);
          const [endHour, endMinute] = endTime.split(":").map(Number);
          
          const [year, month, dayNum] = date.split("-").map(Number);
  
          cron.schedule(`${startMinute} ${startHour} ${dayNum} ${month} *`, () => {
            console.log(`Starting Overtime Zoom Meeting on ${date} at ${startTime}`);
            if (meetingLink && meetingLink.startsWith('http')) {
              shell.openExternal(meetingLink);
            }
          });
  
          cron.schedule(`${endMinute} ${endHour} ${dayNum} ${month} *`, () => {
            console.log(`Closing Overtime Zoom Meeting on ${date} at ${endTime}`);
            closeZoom();
          });
        });
      }

      // Send confirmation back to renderer
      event.reply('schedule-confirm', { success: true });
    } catch (error) {
      event.reply('schedule-confirm', { success: false, error: error.message });
    }
  }); // <-- End of ipcMain.on

  app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
  })
})

app.on('before-quit', () => {
  mainWindow = null;
});

app.on('window-all-closed', () => {
  // On macOS, it's common for applications to quit only when the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }  
})