import express from 'express'
import {uploadTimeSheetData} from '../controllers/timesheetController.js';
import authUser from '../middlewares/authUser.js';

const timesheetRouter = express.Router();

timesheetRouter.post('/upload-timesheet',authUser,uploadTimeSheetData)

export default timesheetRouter

//localhost:4000/api/user/upload-timesheet 