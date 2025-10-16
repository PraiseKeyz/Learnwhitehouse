import express from 'express';
import { login, signup, getUserProfile, promoteUserToAdmin, getallUsers, verifyEmail, forgotPassword, resetPassword, resendVerificationEmail } from '../controllers/authController';
import auth from '../Middlewares/authMiddleware';
import isAdmin from '../Middlewares/adminMiddleware';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/user-profile', auth, getUserProfile)
router.get('/users', auth, isAdmin, getallUsers)
router.post('/verify-email', verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/resend-verification-email', resendVerificationEmail)
router.post('/promote-to-admin', auth, isAdmin, promoteUserToAdmin);

export default router;