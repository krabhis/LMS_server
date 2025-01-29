import AppError from "../utils/error.util.js";
import { razorpay } from '../server.js';
import User from '../models/user.model.js';
import Payment from '../models/payment.model.js';

export const getRazorpayApiKey = async(req,res,next)=>{

    req.status(200).json({
        success:true,
        message:'Razorpay API key',
        key:process.env.RAZORPAY_KEY_ID,
        
    });

}

export const buySubscription = async(req,res,next)=>{
    const { id }=req.user;
    const user = await UserActivation.findById(id);

    if(!user){
        return next(
            new AppError('Unauthorized , please login')
        )
    }

    if(user.role ==='ADMIN'){
        return next(
            new AppError('Admin cannot purchase a subscription', 400)

        )
    }

     // Creating a subscription using razorpay that we imported from the server
  const subscription = await razorpay.subscriptions.create({
    plan_id: process.env.RAZORPAY_PLAN_ID, 
    customer_notify: 1, 
    total_count: 12, 
  });
  
  user.subscription.id = subscription.id;
  user.subscription.status = subscription.status;

  // Saving the user object
  await user.save();

  res.status(200).json({
    success: true,
    message: 'subscribed successfully',
    subscription_id: subscription.id,
  });
  
}

export const verifySubscription = async(req,res,next)=>{
    const {id}=req.user;
    const {razorpayPaymentId , razorpaySubscriptionId , razorpaySignature}=req.body;
 
    const user = await User.findById.(id);

    const subscriptionId = user.subscription.id;

  // Generating a signature with SHA256 for verification purposes
  // Here the subscriptionId should be the one which we saved in the DB
  // razorpayPaymentId is from the frontend and there should be a '|' character between this and subscriptionId
  // At the end convert it to Hex value
    const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(`${razorpayPaymentId}|${subscriptionId}`)
    .digest('hex');


    if (generatedSignature !== razorpaySignature) {
        return next(new AppError('Payment not verified, please try again.', 400));
      }


      await Payment.create({
        razorpayPaymentId,
        razorpaySubscriptionId,
        razorpaySignature,
      });
    



      user.subscription.status = 'active';

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
      });

}