import dotenv, { config } from 'dotenv';
// dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';


// config();

const app =express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors({
origin:[process.env.FRONTED_URL],
credentials:true

}));

app.use(cookieParser());
app.use(morgan('dev'));


// To check wheather server is up or not
app.use('/ping', function(req,res){
res.send('/pong');

});




// To  any api get request then show this error
app.all('*', (req , res)=>{
res.status(404).send('Opps! 404 Page is not found')
});


export default app;


