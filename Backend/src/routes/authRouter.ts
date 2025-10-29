import express from 'express';
import { login, signup, verifyEmail, forgotPassword, resetPassword, resendVerificationEmail } from '../controllers/authController';
import { validateRequest } from '../utils/validation';

const router = express.Router();

// Signup validation
router.post('/signup', validateRequest({
  required: ['firstname', 'surname', 'email', 'password', 'phone', 'department'],
  email: ['email'],
  password: ['password'],
  minLength: { firstname: 2, surname: 2, password: 6 },
  maxLength: { firstname: 50, surname: 50, email: 254, password: 128 }
}), signup);

// Login validation
router.post('/login', validateRequest({
  required: ['email', 'password'],
  email: ['email'],
  password: ['password']
}), login);

// Email verification
router.post('/verify-email', verifyEmail);

// Forgot password validation
router.post('/forgot-password', validateRequest({
  required: ['email'],
  email: ['email']
}), forgotPassword);

// Reset password validation
router.post('/reset-password', validateRequest({
  required: ['token', 'newPassword'],
  password: ['newPassword']
}), resetPassword);

// Resend verification email validation
router.post('/resend-verification-email', validateRequest({
  required: ['email'],
  email: ['email']
}), resendVerificationEmail);

export default router;