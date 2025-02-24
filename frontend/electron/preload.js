const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  scheduleZoom: (timeSheet, overtimeData) => ipcRenderer.send('schedule-zoom', timeSheet,overtimeData),
  onScheduleConfirm: (callback) => ipcRenderer.on('schedule-confirm', callback)
});