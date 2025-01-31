import jwt from "jsonwebtoken";
import { ErrorResponse } from "../Utils/errorrResponse.js";

const authVerify = async (req,res,next)=>{
    try {
        const cookie=req.cookies;
        const authCookie=cookie?.auth_cookie;

        if(!authCookie){
            return res.status(400).json(new ErrorResponse(400,"Access denied , Unauthorised"));
        }

        const data=jwt.verify(authCookie,process.env.JWT_SECRET);
        req.user_id=data.id;
        next();

    } catch (error) {
        console.log(error);
        return res.status(400).json(new ErrorResponse(500,error?.message));
    }
}

export {
    authVerify
}