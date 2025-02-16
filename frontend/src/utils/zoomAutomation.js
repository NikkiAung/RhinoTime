// const scheduleZoomMeetings = (timeSheet, zoomLink) => {
//     window.electronAPI.scheduleZoom(timeSheet, zoomLink);
//   };
  
// export { scheduleZoomMeetings };
  


console.log("Checking window.electronAPI:", window.electronAPI);

const scheduleZoomMeetings = (timeSheet, zoomLink) => {
    if (!window.electronAPI) {
        console.error("🚨 window.electronAPI is undefined!");
        return;
    }
    window.electronAPI.scheduleZoom(timeSheet, zoomLink);
};

export { scheduleZoomMeetings };
