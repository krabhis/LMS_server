import mongoose from "mongoose";
import dotenv  from 'dotenv';
dotenv.config();

mongoose.set('strictQuery', false);
const connectionToDB=async()=>{
  try{
    const {connection}=await mongoose.connect(process.env.MONGO_URI );

    if(connection) {
        console.log(`Connected To Mongodb: ${connection.host}`);
    }

  }
  catch(e){
    console.log(e);
    process.exit(1);
  }




}

export default connectionToDB;

