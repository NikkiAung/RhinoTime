const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  scheduleZoom: (timeSheet, overtimeData, zoomLink) => ipcRenderer.send('schedule-zoom', timeSheet,overtimeData, zoomLink),
  onScheduleConfirm: (callback) => ipcRenderer.on('schedule-confirm', callback)
});