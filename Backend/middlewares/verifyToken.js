import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import {config} from "dotenv"
config()
const {verify}=jwt
export const verifyToken=(...allowedRoles)=>{
    return(req,res,next)=>
    {
        try{
        if(req.method==="OPTIONS")
        {
            return next();
        }
        //token consists of header,payload,signature
        //extract token
        const token=req.cookies?.token
        if(!token)
            return res.status(403).json({message:"Please login first"})
        //verify token if signature is valid return payload
        const decodedToken=verify(token,process.env.SECRET_KEY);
        //check whether the role matches and whether the user is authorised or not
        if(!allowedRoles.includes(decodedToken.role))
        {
            return res.status(401).json({message:"no authority to perform given actions"})
        }
        //store payload(decodedtoken) in req.user body
        req.user=decodedToken
        next();
    }
    catch(err)
    {
        return res.status(401).json({message:"Invalid Token"});
    }
    }
}
