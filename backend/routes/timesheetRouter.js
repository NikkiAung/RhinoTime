import express from 'express'
import {uploadTimeSheetData,getTimeSheetData} from '../controllers/timesheetController.js';
import authUser from '../middlewares/authUser.js';

const timesheetRouter = express.Router();

timesheetRouter.post('/upload-timesheet',authUser,uploadTimeSheetData)
timesheetRouter.get('/get-timesheet',authUser,getTimeSheetData)

export default timesheetRouter

//localhost:4000/api/user/upload-timesheet 
