import express from 'express'
import authUser from '../middlewares/authUser.js';
import { uploadOvertimeSheetData,getOvertimeSheetData,delOvertimeSheetData,updateOvertimeSheetMeetingLink } from '../controllers/overtimesheetController.js';

const overtimesheetRouter = express.Router();

overtimesheetRouter.post('/upload-overtime',authUser,uploadOvertimeSheetData)
overtimesheetRouter.get('/get-overtime',authUser,getOvertimeSheetData)
overtimesheetRouter.post('/delete-overtime',authUser,delOvertimeSheetData)
overtimesheetRouter.post('/update-overtime-meeting-link',authUser,updateOvertimeSheetMeetingLink)

export default overtimesheetRouter