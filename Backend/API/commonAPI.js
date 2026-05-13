import {UserModel} from "../Models/UserSchema.js"
import {hash,compare} from "bcryptjs"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import {verifyToken} from "../middlewares/verifyToken.js"
import exp from "express"
export const commonApp=exp.Router();
const {sign}=jwt
//route to register 
commonApp.post("/register",async(req,res)=>
{
    //get user body from request
    let newUser=req.body
    console.log(req.body)
    newUser.role="USER"
    //if role is not User send error message
    if(newUser.role!="USER")
        return res.status(401).json({error:"given role is invalid"})
    //if role matches hash the password
    newUser.password=await hash(newUser.password,12);
    let newUserDoc=new UserModel(newUser);
    await newUserDoc.save();
    res.status(201).json({user:newUserDoc,message:"User Created"})
    
});
 //route for login
commonApp.post("/login",async(req,res)=>{
    try{
        let {email,password}=req.body;
        let user=await UserModel.findOne({email:email});
        if(!user)
        {
            return res.status(401).json("given email is invalid");
        }
        const isMatched=await compare(password,user.password)
        if(!isMatched)
        {
            return res.status(401).json({message:"Password is invalid"});
        }
        //to generate a token
        const signedToken=sign(
            {
                id:user._id,
                email:user.email,
                role:user.role
            },
            process.env.SECRET_KEY,
            {
                expiresIn:"1h"
            }
        )
        //place token in cookie
        res.cookie("token",signedToken,{
            httpOnly:true,
            secure:true,//for production use secure:true
            sameSite:"none"//for production use sameSite:"none"
        })
        let userObj=user.toObject()
        delete userObj.password
        res.status(200).json({message:"Login Succesful",user:userObj})
    }
    catch(err)
   {
    res.status(401).json({error:`${err}`})
   } 
});
//route for logout
commonApp.get('/logout',async(req,res)=>{
        //delete cookie
        res.clearCookie("token",{
            httpOnly:true,
            secure:true,
            sameSite:"none"
        })
        res.status(200).json({message:"Logout Successful"})
})
//route for changing password
commonApp.put('/password',verifyToken("USER","ADMIN"),async(req,res)=>{
    try{
    // find the user with email in req body
    let email=req.user.email
     let { currentPassword, newPassword } = req.body;
     //find user in mail
    const user=await UserModel.findOne({email:email})
    if(!user)
    {
        return res.status(404).json({message:"Please provide valid email"})
    }
    //check if current password and newpassword are same or not
    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "current password and new password are same" });
    }
    const isMatch=await compare(currentPassword,user.password)
    if(!isMatch)
    {
        return res.status(401).json({message:"current password is wrong"})
    }
    //hash the new password
    let hashedPassword=await hash(newPassword,12)
    //find the user in db and change password
    await UserModel.findOneAndUpdate({email:email},{$set:{password:hashedPassword}})
    res.status(200).json({message:"Password changed successfully"})
}
catch(err)
{
    return res.status(500).json({error:`${err}`})
}
});
//check_auth
commonApp.get("/check-auth", (req, res) => {
  try {
    const token = req.cookies?.token; // ✅ safe access

    if (!token) {
      return res.status(401).json({
        message: "No token found",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    return res.status(200).json({
      message: "Authenticated",
      payload: decoded,
    });
  } catch (err) {
    return res.status(404).json({
      message: "Invalid or expired token",
    });
  }
});
