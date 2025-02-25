const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Schedule Zoom Meetings
  scheduleZoom: (timeSheet, overtimeData) => ipcRenderer.send('schedule-zoom', timeSheet, overtimeData),
  
  onScheduleConfirm: (callback) => {
    ipcRenderer.removeAllListeners('schedule-confirm'); // Prevent duplicate listeners
    ipcRenderer.on('schedule-confirm', (_event, data) => {
      console.log('Schedule confirmation received:', data); // For debugging
      callback(data);
    });
  },

  // Checking for Updates
  updateMessage: (callback) => {
    try {
      ipcRenderer.removeAllListeners('updateMessage');
      ipcRenderer.on('updateMessage', (_event, message) => {
        console.log('Update message received:', message); // For debugging
        callback(message);
      });
    } catch (error) {
      console.error('Error in updateMessage handler:', error);
    }
  }
});