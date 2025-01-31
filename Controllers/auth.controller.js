import User from "../Models/user.model.js";
import { SuccessResponse } from "../Utils/successResponse.js";
import { ErrorResponse } from "../Utils/errorrResponse.js";
import bcrypt from "bcrypt";
import { SALT_ROUND } from "../Constants/constants.js";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json(new ErrorResponse(400, "all fields are required"));
    }

    const user = await User.findOne({
      email,
    });

    if (user) {
      return res
        .status(400)
        .json(new ErrorResponse(400, "User already registered , Kindly login"));
    }

    const salt = await bcrypt.genSalt(SALT_ROUND);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const data = new User(req.body);
    await data.save();

    return res
      .status(200)
      .json(new SuccessResponse(200, data, "User registered succesfully"));
  } catch (error) {
    console.log(error);
    return res.status(400).json(new ErrorResponse(500, error?.message));
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json(new ErrorResponse(400, "all fields are required"));
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res
        .status(400)
        .json(new ErrorResponse(400, "User not registered , Kindly register"));
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res
        .status(400)
        .json(
          new ErrorResponse(400, "Incorrect password , Check your credentials")
        );
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,{expiresIn:'5h'});

    res.cookie("auth_cookie", token, { maxAge: 5 * 60 * 60 * 1000, httpOnly: true, sameSite: "None" , secure: true, });

    return res
      .status(200)
      .json(new SuccessResponse(200, {token:token,role:user.role}, "User logged in successfully"));
  } catch (error) {
    console.log(error);
    return res.status(400).json(new ErrorResponse(500, error?.message));
  }
};

const me = async (req,res)=>{
  try {
    const user_id=req.user_id;
    const data=await User.findById(user_id);

    return res
      .status(200)
      .json(new SuccessResponse(200, data, "User details fetched successfully"));

    
  } catch (error) {
    console.log(error);
    return res.status(400).json(new ErrorResponse(500, error?.message));
  }
}

const logout= async (req,res)=>{
  try {
    res.clearCookie('auth_cookie',{
      httpOnly: true, sameSite: "None" , secure: true,
    });
    return res.status(200).json(
      new SuccessResponse(200,null,'user logged out succesfully')
    )
  } catch (error) {
    console.log(error);
    return res.status(400).json(new ErrorResponse(500, error?.message));
  }
}

const isloggedIn= async (req,res)=>{
  try {
    const islogedIn=  req.auth;

    if(!islogedIn){
      return res.status(200).json(
        new SuccessResponse(200,islogedIn,'user is logged out ')
      )
       
    }

    return res.status(200).json(
      new SuccessResponse(200,islogedIn,'user is logged in')
    )
  } catch (error) {
    console.log(error);
    return res.status(400).json(new ErrorResponse(500, error?.message));
  }
}

export {
    register,
    login,
    me,
    logout,
    isloggedIn
}