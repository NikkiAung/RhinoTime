const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  scheduleZoom: (timeSheet, zoomLink) => ipcRenderer.send('schedule-zoom', timeSheet, zoomLink)
});