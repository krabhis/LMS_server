import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary';
import jwt from "jsonwebtoken";
import fs from 'fs/promises';
import bcrypt from 'bcrypt';
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';
// import { log } from "console";
// import asyncHandler from '../middlewares/asyncHandler.middleware.js




const cookieOptions={
maxAge:7*24*60*60*1000, //7 days in millisec
httpOnly:true,
secure:true

}
const register= async (req ,res , next)=>{
const{fullName , email , password}=req.body;


if (!fullName || !email || !password){
    return  next(new AppError('All fields are required',400));
}

const userExists= await User.findOne({email});
if(userExists){
return next(new AppError(`Email already exists`,400));

}
const user = await User.create({
fullName,
email,
password,
avatar:{
    public_id: email,
    secure_url:"https://res.cloudinary",
}
});

if (!user){
return next(new AppError('User registration failed, please try again',400))
}

// TODO File UPload
// console.log('File Details:',req.file);

if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'learn_management_sys', // Save files in a folder named lms
        width: 250,
        height: 250,
        gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
        crop: 'fill',
      });

      // If success
      if (result) {
        // Set the public_id and secure_url in DB
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // After successful upload remove the file from local storage
         await fs.rm(`uploads/${req.file.filename}`);
      }
    } 
    catch (error) {
        console.error("Cloudinary Upload Error:", error.message || JSON.stringify(error));
        return next(new AppError(error.message || 'File not uploaded, please try again', 400));
    }
  }




await user.save();

user.password= undefined;

const token=await user.generateJWTToken();

res.cookie('token', token ,cookieOptions)  


res.status(201).json({
success:true,
message:'User registered successfully',
user,


})





};
const login = async (req, res, next) => {
    // Destructuring the necessary data from req object
    const { email, password } = req.body;
    console.log(req.body)
  
    if (!email || !password) {
      return next(new AppError('Email and Password are required', 400));
    }
  
    const user = await User.findOne({ email }).select('+password');
  
    // If no user or sent password do not match then send generic response
    if (!(user && (await user.comparePassword(password)))) {
      return next(
        new AppError('Email or Password do not match or user does not exist', 401)
      );
    }
  
    // Generating a JWT token
    const token = await user.generateJWTToken();
  
    // Setting the password to undefined so it does not get sent in the response
    user.password = undefined;
  
    // Setting the token in the cookie with name token along with cookieOptions
    res.cookie('token', token, cookieOptions);
  
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      user,
    });
  };

const logout=(req,res)=>{
    res.cookie('token',null,{
        secure:true,
        maxAge:0,
        httpOnly:true

    });

    res.status(200).json({
        success:true,
        message:'User logged out successfully'

    })


};

const getProfile= async (req,res)=>{
    try{
        
const userId= req.user.id;
const user= await User.findById(userId);

res.status(200).json({
success:true,
message:'User details',
user

});

    }
    catch(e){
        return next(new AppError('Failed to fetch profile'))
}

};

const forgotPassword= async (req,res,next)=>{
    const {email}=req.body;

    if(!email){
        return next(new AppError('Email is required',400));

    }
    const user=await User.findOne({email});
    
    if(!user){
        return next (new AppError('Email not registered',400));
    }

    const resetToken= await user.generatePasswordResetToken();
     
    await user.save();
    const resetPasswordUrl = `${process.env.FRONTENED_URL}/reset-password/${resetToken}`;//url jo mail me send krne liye...

    console.log(resetPasswordUrl);

    const subject= 'Reset Password';
    const message='`You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;'

    try{
        await sendEmail(email,subject, message);

        res.status(200).json({
            success:true,
            message:`Reset password token has been sent to ${email} successfully`
        })
    }
    catch(e){

        user.forgotPasswordExpiry= undefined;  //in case mail na ja paye
        user.forgotPasswordToken= undefined; 
        

        await user.save();
        return next(new AppError(e.message, 500));


    }



}
const resetPassword=async(req,res)=>{
    const{ resetToken}=req.params;

    const { password }=req.body;

    const forgotPasswordToken= crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    const user=await User.findOneAndUpdate({
        forgotPasswordToken,
        forgotPasswordExpiry:{$gt: Date.now()}

    });
    if(!user){
        return next(
            new AppError('Token is invalid or expired, please try again',400)
        )
    }
    user.password=password;
    user.forgotPasswordToken=undefined;
    user.forgetPasswordExpiry=undefined;

    user.save();
    res.status(200).json({
        success:true,
        message:'Password changed successfully!'
    })



}

const changePassword=async()=>{
const {oldPassword , newPassword}=req.body;
const { id }=req.user;

if(!oldPassword || newPassword){
    return next(
        new AppError('All field are mandatory' , 400)
    )
}

const user=await User.findById(id).select('+password');

if(!user){
    return next(
        new AppError('User doesnt exist',400)
    )
}

const isPasswordValid= await user.comparePassword(oldPassword);

if(!isPasswordValid){
    return next(
        new AppError('Invalid old password' , 400)
    )
}
user.password = newPassword;
await user.save();

user.password=undefined;

res.status(200).json({
    success:true,
        message:'Password changed successfully!'

})
}
const updateUser= async (req,res)=>{
const {fullName}=req.body;
const { id }= req.user.id;

const user = await User.findById(id);

if(!user){

    return next(
        new AppError('User does not exist' , 400)
    )

}

if(req.fullName){
    user.fullName= fullName;
}
if(req.file){
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'lms', // Save files in a folder named lms
          width: 250,
          height: 250,
          gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
          crop: 'fill',
        });
  
        // If success
        if (result) {
          // Set the public_id and secure_url in DB
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;
  
          // After successful upload remove the file from local storage
          fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (error) {
        return next(
          new AppError(error || 'File not uploaded, please try again', 400)
        );
      }

    


}

await user.save();

res.status(200).json({
    success:true,
    message:'User details updated successfully'
})



}


export{
register,
login,
logout,
getProfile,
forgotPassword,
changePassword,

resetPassword,
updateUser
}

