import {Router} from 'express';
import {getProfile, login, logout, register, forgotPassword, resetPassword, updateUser, changePassword} from "../controllers/user.controller.js"
import  isLoggedIn  from '../middlewares/auth.middleware.js';
import upload from "../middlewares/multer.middleware.js";

// Braces create a destructuring pattern to extract only Router class from express module.(cocept of destructure)
const router=Router();

router.post('/register', upload.single("avatar"), register);
router.post('/login',login);
router.get('/logout',logout);
router.get('/me',  isLoggedIn, getProfile);
router.post('/forgot/password',  forgotPassword);
router.post('/reset/:resetToken', resetPassword);
router.post('/change-password', isLoggedIn, changePassword);
router.put('/update', isLoggedIn, upload.single("avatar"), updateUser)






export default router;



