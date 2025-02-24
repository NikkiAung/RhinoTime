const scheduleZoomMeetings = (timeSheet, overtimeData) => {
    return new Promise((resolve, reject) => {
        if (!window.electronAPI) {
            console.error("🚨 window.electronAPI is undefined!");
            reject(new Error("Electron API not available"));
            return;
        }

        // Listen for confirmation
        window.electronAPI.onScheduleConfirm((_event, response) => {
            if (response.success) {
                resolve(true);
            } else {
                reject(new Error(response.error || 'Failed to schedule'));
            }
        });

        // Send schedule request
        window.electronAPI.scheduleZoom(timeSheet, overtimeData);
    });
};

export { scheduleZoomMeetings };
