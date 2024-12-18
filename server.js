import 'express-async-errors';
import * as env from 'dotenv'
env.config();
import express from "express";
import cors from 'cors'
import morgan from 'morgan';
import jobRouter from './routes/jobRouter.js';
import authRouter from './routes/authRouter.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRouter.js'

// DB connection
import connectDB from './DB/connection.js';

const app = express();
app.use(cors())
app.use(cookieParser());
app.use(express.json());

// middleware 
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';

app.use('/api/v1/jobs', authenticateUser, jobRouter)
app.use('/api/v1/users', authenticateUser, userRouter)
app.use('/api/v1/auth', authRouter)

app.get('/api/v1/test', (req, res) => {
    res.json({ msg: "test route" })
})

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('common'));
}

app.use('*', (req, res) => {
    console.log(req.originalUrl);
    return res.status(404).json({ msg: 'Not Found' })
})

app.use(errorHandlerMiddleware)


const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`server is listing at port no ${port}`);
        })
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

start();
