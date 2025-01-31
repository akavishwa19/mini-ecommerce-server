import { SuccessResponse } from "../Utils/successResponse.js";
import { ErrorResponse } from "../Utils/errorrResponse.js";
import { uploader } from "../Services/uploader.js";

const uploadMedia = async (req,res)=>{
    try {
        const file=req.file;
        const data=await uploader(file.path);        
        return res.status(200).json(new SuccessResponse(200,data,'file upload succesfull'))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new ErrorResponse(500,error?.message));
    }
}

export {
    uploadMedia
}