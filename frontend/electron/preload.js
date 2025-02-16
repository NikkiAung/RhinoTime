const { contextBridge, ipcRenderer } = require('electron');

console.log("✅ Preload.js is running!"); // Debugging log

contextBridge.exposeInMainWorld('electronAPI', {
  scheduleZoom: (timeSheet, zoomLink) => ipcRenderer.send('schedule-zoom', timeSheet, zoomLink)
});