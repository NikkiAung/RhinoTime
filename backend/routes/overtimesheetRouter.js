import express from 'express'
import authUser from '../middlewares/authUser.js';
import { uploadOvertimeSheetData,getOvertimeSheetData,delOvertimeSheetData } from '../controllers/overtimesheetController.js';

const overtimesheetRouter = express.Router();

overtimesheetRouter.post('/upload-overtime',authUser,uploadOvertimeSheetData)
overtimesheetRouter.get('/get-overtime',authUser,getOvertimeSheetData)
overtimesheetRouter.post('/delete-overtime',authUser,delOvertimeSheetData)

export default overtimesheetRouter