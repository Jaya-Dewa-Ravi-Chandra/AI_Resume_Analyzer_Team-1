import exp from 'express'
import {config} from "dotenv"
import {connect} from "mongoose"
import cookieParser from "cookie-parser"
import {commonApp} from "./API/commonAPI.js" 
import {resumeApp} from "./API/resumeAPI.js"
import {adminApp} from "./API/adminAPI.js";
import cors from "cors"
config();
const app=exp();
app.set("trust proxy", 1);
app.use(
  cors({
    origin: "https://ai-resume-analyzer-team-1.vercel.app",
    credentials: true,
  }),
);
app.use(exp.json());
app.use(cookieParser());
app.use('/commonApi',commonApp)
app.use('/resumeApi',resumeApp)
app.use('/adminApi',adminApp)
//to send cookie

const connectDb=async()=>{
    try{
       
        await connect(process.env.DB_URL);
        console.log("Database connected....");
        app.listen(process.env.PORT||4000,()=>console.log(`server running on the port ${process.env.PORT}`));
    }
    catch(err){
        console.log(err);
    }
}
connectDb()
