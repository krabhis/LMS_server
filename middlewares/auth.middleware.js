import  AppError from "../utils/error.util.js";
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const isLoggedIn = async (req,res,next)=>{
   const {token}=req.cookies;

   if(!token){
       return next(new AppError('Unauthenticated, please login again', 400))
   }

   const userDetails = await jwt.verify(token,process.env.JWT_SECRET,process.env.JWT_EXPIRY);
   req.user=userDetails;

   next();
}

const authorizeRoles= (...roles)=>async(req,res,next)=>{
  const currentUserRoles= req.user.roles;
  if(roles.includes(currentUserRoles)){
     return next(
        new AppError('You do not  have permission to  access')
     )

  }
  next();
  
}
const authorizeSubscribers= async(req,res,next)=>{
  const subscription=req.user.subscription;
  const currentUserRoles= req.user.roles;

  const user=await User.findById(req.user.id);

  if(user.role !=='ADMIN' && user.subscription.status!=='active'){
     return next(
        new AppError('Please subscribe to access this route', 400)
     )

  }
next();
}

export{
   isLoggedIn,
   authorizeRoles,
   authorizeSubscribers

}

