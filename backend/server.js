import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoute.js'

//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()

//middlewares
app.use(express.json())
app.use(cors())

//localhost:4000/api/user/register
app.use('/api/user/',userRouter)

//localhost:4000
app.get('/',(req,res)=>{
    res.send('API WORKING')
})

app.listen(port, ()=> console.log("Server Started",port))