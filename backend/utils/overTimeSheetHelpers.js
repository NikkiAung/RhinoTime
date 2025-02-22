// 🛠️ Helper function to convert Date to Weekday
const getDayFromDate = (dateObj) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[dateObj.getUTCDay()]; // Get the actual day
};

export {getDayFromDate};