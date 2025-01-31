import { v2 as cloudinary } from "cloudinary";
import { ErrorResponse } from "../Utils/errorrResponse.js";
import fs from "fs"

export async function uploader(file) {
  try {
    const upload = await cloudinary.uploader.upload(file);
    fs.unlinkSync(file)
    return upload;
  } catch (error) {
    console.log(error);
    return res.staus(500).json(new ErrorResponse(500, error?.message));
  }
}
