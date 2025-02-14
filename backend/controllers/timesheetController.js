import userModel from '../models/userModel.js';

const uploadTimeSheetData = async (req, res) => {
    console.log('uploading')
    const { timeSheet, userId } = req.body;
    console.log(timeSheet)
    console.log(userId)
    try {
      // 1. Validate timeSheet is an object
      if (!timeSheet || typeof timeSheet !== 'object') {
        return res.json({ success: false, message: 'Invalid timeSheet format' });
      }
  
      // 2. Check each day’s start/end time
      for (const [day, { startTime, endTime }] of Object.entries(timeSheet)) {
        if (!startTime || !endTime) {
          return res.json({ success: false, message: `Missing time for ${day}` });
        }
      }
  
      // 3. Update user in DB
      const updatedUser = await userModel.findByIdAndUpdate(
        userId, 
        { $set: { tutoring_date_and_time: timeSheet } }, 
        { new: true }
      );
    //   console.log("Updated User Data:", updatedUser);
  
      // 4. Send success
      return res.json({ success: true, message: 'TimeSheet updated successfully' });
  
    } catch (error) {
      console.log(error);
      return res.json({ success: false, message: error.message });
    }
  };

export {uploadTimeSheetData}  