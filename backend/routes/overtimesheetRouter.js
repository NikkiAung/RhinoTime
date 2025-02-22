import express from 'express'
import authUser from '../middlewares/authUser.js';
import { uploadOvertimeSheetData } from '../controllers/overtimesheetController.js';

const overtimesheetRouter = express.Router();

overtimesheetRouter.post('/upload-overtime',authUser,uploadOvertimeSheetData)

export default overtimesheetRouter