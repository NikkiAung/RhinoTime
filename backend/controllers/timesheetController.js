import userModel from '../models/userModel.js';

const uploadTimeSheetData = async (req, res) => {
    const { timeSheet, userId } = req.body;

    try {
    //   1. Validate timeSheet is an object
      if (!timeSheet || typeof timeSheet !== 'object') {
        return res.json({ success: false, message: 'Invalid timeSheet format' });
      }
  
      // 2. Check each day’s start/end time
      for (const [day, { startTime, endTime }] of Object.entries(timeSheet)) {
        if (!startTime || !endTime) {
          if(!startTime){
            timeSheet[day].startTime = '00:00';
          }
          if(!endTime){
            timeSheet[day].endTime = '00:00';
          }
        }
      }
  
      // 3. Update user in DB
      const updatedUser = await userModel.findByIdAndUpdate(
        userId, 
        { $set: { tutoring_date_and_time: timeSheet } }, 
        { new: true }
      ).select('-password');
  
      // 4. Send success
      return res.json({ success: true, message: 'TimeSheet updated successfully' });
  
    } catch (error) {
      console.log(error);
      return res.json({ success: false, message: error.message });
    }
  };

const getTimeSheetData = async (req,res) => {

    const {userId} = req.body

    try {
        const userData = await userModel.findById(userId).select('-password')
        if(!userData){
            return res.json({success:false,message:"User Doesn't Exist!"})
        }

        return res.json({ success: true, timeSheet : userData.tutoring_date_and_time });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }

}

const updateTimeSheetData = async (req, res) => {
    try {
        const { userId, day, field, value } = req.body;

        if (!userId || !day || !field || value === undefined) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        // MongoDB update query to modify only the specific field
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: { [`tutoring_date_and_time.${day}.${field}`]: value } }, 
            { new: true, runValidators: true } // `new: true` returns the updated document
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        return res.json({ success: true, message: "Time updated successfully!" });

    } catch (error) {
        console.error("Error updating time:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const delTimeSheetData = async (req, res) => {
    try {
      console.log('del data from backend')
        const { userId } = req.body;
        console.log(userId)
        if (!userId) {
            return res.status(400).json({ success: false, message: "Not Authorised!" });
        }

        // MongoDB update query to modify only the specific field
        const updatedUser = await userModel.findByIdAndUpdate(
          userId,
          { 
              $set: { 
                  tutoring_date_and_time: {},
                  tutoring_overtime: {}
              } 
          },
          { new: true, runValidators: true }
        ).select('-password');
        
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
        console.log("Updated User Data:", updatedUser);

        return res.json({ success: true, message: "Time deleted successfully!" });
    } catch (error) {
        console.error("Error deleting time:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export {uploadTimeSheetData,getTimeSheetData,updateTimeSheetData,delTimeSheetData}  