import { Router } from "express";

const router=Router();

router.post('/register', upload.single("avatar"), register);
router.post('/login',login);
router.get('/logout',logout);
router.get('/me',  isLoggedIn, getProfile);
router.post('/forgot/password',  forgotPassword);
router.post('/reset/:resetToken', resetPassword);
router.post('/change-password', isLoggedIn, changePassword);
router.put('/update', isLoggedIn, upload.single("avatar"), updateUser)