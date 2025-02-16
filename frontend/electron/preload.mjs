// const { contextBridge, ipcRenderer } = require('electron');
import { contextBridge, ipcRenderer } from 'electron';

console.log("✅ Preload.js is running!"); // Debugging log

contextBridge.exposeInMainWorld('electronAPI', {
  scheduleZoom: (timeSheet, zoomLink) => ipcRenderer.send('schedule-zoom', timeSheet, zoomLink)
});

