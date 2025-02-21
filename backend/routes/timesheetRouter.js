import express from 'express'
import {uploadTimeSheetData,getTimeSheetData,updateTimeSheetData} from '../controllers/timesheetController.js';
import authUser from '../middlewares/authUser.js';

const timesheetRouter = express.Router();

timesheetRouter.post('/upload-timesheet',authUser,uploadTimeSheetData)
timesheetRouter.get('/get-timesheet',authUser,getTimeSheetData)
timesheetRouter.get('/update-timesheet',authUser,updateTimeSheetData)

export default timesheetRouter

//localhost:4000/api/user/upload-timesheet 
