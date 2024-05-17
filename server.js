import app from './app.js';

const PORT=process.env.PORT||1000;


app.listen(PORT,async()=>{
    await connectionToDB();
    console.log(`App is running at http:localhost:-${PORT}`);     


});