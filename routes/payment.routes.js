import { Router } from 'express';
import {
  getRazorpayApiKey,
  buySubscription,
  verifySubscription,
  cancelSubscription,
  allPayments,
} from '../controllers/payment.controller.js';
import {
  authorizeRoles,
  authorizeSubscribers,
  isLoggedIn,
} from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/subscribe')
                          .post(isLoggedIn, buySubscription);
router.route('/verify')
                       .post(isLoggedIn, verifySubscription);
router
  .route('/unsubscribe')
  .post(isLoggedIn, authorizeSubscribers, cancelSubscription);
router.route('/razorpay-key')
                           .get(isLoggedIn, getRazorpayApiKey);
router.route('/')
                 .get(isLoggedIn, authorizeRoles('ADMIN'), allPayments);

export default router;


// import express from 'express';
// import {
//   getRazorpayApiKey,
//   buySubscription,
//   verifySubscription,
//   cancelSubscription,
//   allPayments,
// } from '../controllers/payment.controller.js';

// import {
//   authorizeRoles,
//   authorizeSubscribers,
//   isLoggedIn,
// } from '../middlewares/auth.middleware.js';

// const router = express.Router();

// // Subscription Routes
// router.post('/subscribe', isLoggedIn, buySubscription);
// router.post('/verify', isLoggedIn, verifySubscription);
// router.post('/unsubscribe', isLoggedIn, authorizeSubscribers, cancelSubscription); 

// // Razorpay API Key Route
// router.get('/razorpay-key', isLoggedIn, getRazorpayApiKey);

// // Admin Route for Viewing All Payments
// router.get('/', isLoggedIn, authorizeRoles('ADMIN'), allPayments);

// export default router;
