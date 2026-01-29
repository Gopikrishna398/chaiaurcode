import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
// import dotenv from 'dotenv';
// dotenv.config({
//     path: './env'
// })

const connectDB = async ()=>{
    try{
        const connectInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log("MONGODB connected sucssesfully",connectInstance.connection.host);
    }
    catch(error){
        console.log("MONGOOSE CONNECTION FAILED",error);
        process.exit(1)
    }
}

export default connectDB;