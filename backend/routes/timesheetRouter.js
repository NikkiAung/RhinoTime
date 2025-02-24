import express from 'express'
import {uploadTimeSheetData,getTimeSheetData,updateTimeSheetData,delTimeSheetData,updateTimeSheetMeetingLink} from '../controllers/timesheetController.js';
import authUser from '../middlewares/authUser.js';

const timesheetRouter = express.Router();

timesheetRouter.post('/upload-timesheet',authUser,uploadTimeSheetData)
timesheetRouter.get('/get-timesheet',authUser,getTimeSheetData)
timesheetRouter.post('/update-timesheet',authUser,updateTimeSheetData)
timesheetRouter.post('/delete-all-times',authUser,delTimeSheetData)
timesheetRouter.post('/update-timesheet-meeting-link',authUser,updateTimeSheetMeetingLink)

export default timesheetRouter
