import { app, BrowserWindow,ipcMain, shell } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url';
import cron from 'node-cron'
import { exec } from 'child_process';

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

app.whenReady().then(() => {
  createWindow()
  
  ipcMain.on('schedule-zoom', (event, timeSheet, overtimeData, zoomLink) => {

    try {
      // mainTime cron
      for (const [day, { startTime, endTime }] of Object.entries(timeSheet)) {
        if(startTime === '00:00' && endTime === '00:00') {
          continue;
        }
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);
  
        cron.schedule(`${startMinute} ${startHour} * * ${getCronDay(day)}`, () => {
          console.log(`Starting Zoom Meeting for ${day} at ${startTime}`);
          shell.openExternal(zoomLink);
        });
  
        cron.schedule(`${endMinute} ${endHour} * * ${getCronDay(day)}`, () => {
          console.log(`Closing Zoom Meeting for ${day} at ${endTime}`);
          closeZoom();
        });
      }
      // overTime cron
      for (const [day, overtimeEntries] of Object.entries(overtimeData)) {
        overtimeEntries.forEach(({ date, startTime, endTime }) => {
          const [startHour, startMinute] = startTime.split(":").map(Number);
          const [endHour, endMinute] = endTime.split(":").map(Number);
          
          const [year, month, dayNum] = date.split("-").map(Number);
  
          cron.schedule(`${startMinute} ${startHour} ${dayNum} ${month} *`, () => {
            console.log(`Starting Overtime Zoom Meeting on ${date} at ${startTime}`);
            shell.openExternal(zoomLink);
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