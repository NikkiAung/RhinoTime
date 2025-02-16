const scheduleZoomMeetings = (timeSheet, zoomLink) => {
    if (!window.electronAPI) {
        console.error("🚨 window.electronAPI is undefined!");
        return;
    }
    window.electronAPI.scheduleZoom(timeSheet, zoomLink);
};

export { scheduleZoomMeetings };
