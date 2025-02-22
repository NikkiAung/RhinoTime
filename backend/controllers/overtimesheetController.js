import userModel from '../models/userModel.js';
import {getDayFromDate} from '../utils/overTimeSheetHelpers.js'

const uploadOvertimeSheetData = async (req, res) => {
    try {
        const { userId, newOverTime } = req.body;

        if (!userId || !newOverTime || typeof newOverTime !== 'object') {
            return res.json({ success: false, message: 'Invalid request data' });
        }

        // Extract day (e.g., "Monday") dynamically
        const day = Object.keys(newOverTime)[0]; // Get the key dynamically (Monday, Tuesday, etc.)
        const newOvertimeData = newOverTime[day];

        const dateObj = new Date(newOvertimeData.date);
        const actualDay = getDayFromDate(dateObj);

        if (actualDay !== day) {
            return res.json({
                success: false,
                message: `The entered date (${newOvertimeData.date}) is a ${actualDay}, not a ${day}.`
            });
        }

        // Find user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Ensure `tutoring_overtime` exists
        let updatedOvertime = user.tutoring_overtime || {}; 

        // Check if the day already exists
        if (!updatedOvertime[day]) {
            updatedOvertime[day] = [];
        }

        // Duplicate Check: Ensure the same date, start time, and end time doesn't already exist**
        const isDuplicate = updatedOvertime[day].some(entry =>
            entry.date === newOvertimeData.date &&
            entry.startTime === newOvertimeData.startTime &&
            entry.endTime === newOvertimeData.endTime
        );

        if (isDuplicate) {
            return res.json({ success: false, message: 'Oops! This slot already booked!' });
        }

        // Append the new overtime entry
        updatedOvertime[day].push(newOvertimeData);

        // Update the document
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: { tutoring_overtime: updatedOvertime } },
            { new: true, runValidators: true }
        );

        return res.json({ success: true, message: 'Overtime sheet updated successfully', updatedUser });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export { uploadOvertimeSheetData };
