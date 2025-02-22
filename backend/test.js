const getDayFromDate = (dateObj) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // return daysOfWeek[dateObj.getUTCDay()]; // Get the actual day
    return dateObj.getUTCDay()
};

const dateObj = new Date('2025-02-22');
console.log(dateObj);

const actualDay = getDayFromDate(dateObj);
console.log(actualDay);


