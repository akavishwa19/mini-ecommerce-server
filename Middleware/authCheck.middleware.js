import jwt from "jsonwebtoken";
import { ErrorResponse } from "../Utils/errorrResponse.js";
import { SuccessResponse } from "../Utils/successResponse.js";

const authCheck = async (req,res,next)=>{
    try {
        const cookie=req.cookies;
        const authCookie=cookie?.auth_cookie;
        let loggedIn=false;

        if(!authCookie){
            loggedIn=false;
            req.auth=loggedIn
            next();
        }
        else{
            const data=jwt.verify(authCookie,process.env.JWT_SECRET);
            req.user_id=data.id;
            loggedIn=true;
            req.auth=loggedIn
            next();
        }     

    } catch (error) {
        console.log(error);
        return res.status(400).json(new ErrorResponse(500,error?.message));
    }
}

export {
    authCheck
}