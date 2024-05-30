import { Router } from "express";
import { changePassword, forgotPassword, getProfile, login, logout, register, resetPassword, updateUser } from "../controllers/user.controller.js";


const router=Router();

router.post('/register',upload.single("avatar"),register);
router.post('/login',login);
router.get('/logout',logout);
router.get('/me',   getProfile);
router.post('/forgot/password',  forgotPassword);
router.post('/reset/:resetToken', resetPassword);
router.post('/change-password', changePassword);
router.put('/update' , updateUser);


export default router;