import dotenv, { config } from 'dotenv';
dotenv.config();
import express from 'express';
import userRoutes from './routes/user.routes.js'
import courseRoutes from './routes/course.routes.js'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import errorMiddleware from "./middlewares/error.middleware.js"

import cors from 'cors';
import { closeSync } from 'fs';



const app =express();



app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors({
origin:[process.env.FRONTEND_URL],
credentials:true

}));

app.use(cookieParser());//middleware
app.use(morgan('dev'));//middleware


// Routing
app.use('/api/v1/user',userRoutes);
app.route('/api/v1/courses',courseRoutes);


// config();



// To check wheather server is up or not
app.use('/ping', function(req,res){
res.send('/pong');

});


// To  any api get request then show this error
app.all('*', (req , res)=>{
res.status(404).send('Opps! 404 Page is not found')
});

app.use(errorMiddleware);
export default app;



