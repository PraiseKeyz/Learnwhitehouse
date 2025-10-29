import { Request, Response } from 'express';
import User from '../model/user.model';
import dotenv from 'dotenv';
import crypto from 'crypto'
import { ApiResponse } from '../types';
import logger from '../utils/logger';
import argon2 from 'argon2';
import RefreshToken from '../model/refreshToken.model';
import PasswordReset from '../model/passwordReset.model';
import { generateAccessToken, generateRefreshToken, getTokenExpirationTime, verifyAccessToken, verifyRefreshToken } from '../utils/jwt';
import emailService from '../services/emailService';
dotenv.config();

export const authController = {
    signup: async (req: Request, res: Response<ApiResponse>) => {
        try {
            const { firstname, lastname, email, password } = req.body;
            
            // Validate required fields
            if (!firstname || !lastname || !email || !password) {
                logger.error({ error: "Missing required fields" });
                return res.status(400).json({ success: false, message: "Missing required fields" });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                logger.error({ error: "Email already registered" });
                return res.status(400).json({ success: false, message: "Email already registered" });
            }

            // Hash password
            const passwordHash = await argon2.hash(password);
            
            // Generate verification token
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

            // Create user
            const user = new User({
                firstname,
                lastname,
                email,
                password: passwordHash,
                verificationToken,
                verificationTokenExpiresAt
            });

            await user.save();
            
            // Generate access token
            const token = generateAccessToken(user);
            const { password: _, ...userWithoutPassword } = user.toObject();
            
            // Send verification email
            try {
                await emailService.sendEmailVerificationEmail(email, verificationToken, `${user.firstname} ${user.surname}`);
            } catch (emailError) {
                logger.warn({ error: emailError }, "Failed to send verification email");
            }
            
            logger.info({ userId: user._id }, "New account created successfully");
            res.status(201).json({ 
                success: true, 
                message: "New account created. Please check your email to verify your account.", 
                data: { user: userWithoutPassword, token } 
            });
        }
        catch (error) {
            logger.error({ error }, "Failed to signup an account");
            res.status(500).json({ success: false, error: "Failed to signup an account" });
        }
    },

    signin: async (req: Request, res: Response<ApiResponse>) => {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                logger.error({ error: "Email and password are required" });
                return res.status(400).json({ success: false, error: "Email and password are required" });
            }

            const user = await User.findOne({ email });
            if (!user) {
                logger.error({ error: "Invalid email or password" });
                return res.status(400).json({ success: false, error: "Invalid email or password" });
            }

            const passwordValid = await argon2.verify(user.password, password);
            if (!passwordValid) {
                logger.error({ error: "Invalid email or password" });
                return res.status(400).json({ success: false, error: "Invalid email or password" });
            }

            const token = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            const refreshTokenDoc = new RefreshToken({
                token: refreshToken,
                userId: user._id,
                expiresAt: getTokenExpirationTime(
                    process.env.JWT_REFRESH_EXPIRES_IN || '7d'
                )
            });

            await refreshTokenDoc.save();
            const { password: _, ...userWithoutPassword } = user.toObject();
            
            logger.info({ email: user.email }, "Signin successful");
            res.status(200).json({ 
                success: true, 
                message: "Signin successful", 
                data: { user: userWithoutPassword, token, refreshToken } 
            });
    }
    catch (error) {
            logger.error({ error }, "Failed to signin an account");
            res.status(500).json({ success: false, error: "Failed to signin an account" });
    }
    },

// verify user email function
    verifyEmail: async (req: Request, res: Response<ApiResponse>) => {
    try {
            const { token } = req.body;
  
      if (!token) {
                logger.error({ error: "Verification token is required" });
                return res.status(400).json({ 
                    success: false, 
                    error: 'Verification token is required' 
                });
            }

            const user = await User.findOne({ 
                verificationToken: token, 
                emailVerified: false 
            });
  
      if (!user) {
                logger.error({ error: "Invalid or expired verification token" });
                return res.status(400).json({ 
                    success: false, 
                    error: 'Invalid or expired verification token' 
                });
            }

            // Check if token is expired
            if (user.verificationTokenExpiresAt && user.verificationTokenExpiresAt < new Date()) {
                logger.error({ error: "Verification token has expired" });
                return res.status(400).json({ 
                    success: false, 
                    error: 'Verification token has expired' 
                });
            }

            user.emailVerified = true;
            user.verificationToken = null;
            user.verificationTokenExpiresAt = new Date();
      await user.save();
  
            // Send welcome email after successful verification
            try {
                await emailService.sendWelcomeEmail(
                    user.email,
                    `${user.firstname} ${user.surname}`
                );
            } catch (emailError) {
                logger.warn({ error: emailError, userId: user._id }, "Failed to send welcome email");
            }

            logger.info({ userId: user._id }, "Email verified successfully");
            res.status(200).json({ 
                success: true, 
                message: 'Email verified successfully!' 
            });
    } catch (error) {
            logger.error({ error }, "Email verification failed");
            res.status(500).json({ 
                success: false, 
                error: 'Email verification failed' 
            });
        }
    },

    verifyToken: async (req: Request, res: Response<ApiResponse>) => {
        try {
            const { token } = req.body;
            const decoded = verifyAccessToken(token);
            res.status(200).json({ success: true, message: "Token verified", data: decoded });
        }
        catch (error) {
            logger.error( {error: "Failed to verify token"} );
            res.status(400).json({ success: false, error: "Failed to verify token" });
        }
    },

    
  // Refresh access token
  refreshToken: async (
    req: Request,
    res: Response<ApiResponse<{ accessToken: string; refreshToken: string }>>
  ) => {
    try {
        const { refreshToken } = req.body;

        // Input validation
        if (!refreshToken || typeof refreshToken !== 'string') {
          logger.warn({ error: 'Refresh token missing or invalid' });
          return res.status(400).json({
            success: false,
            error: 'Refresh token is required',
          });
        }
    
        // Verify refresh token
        let payload;
        try {
          payload = verifyRefreshToken(refreshToken);
        } catch (error) {
          logger.warn('Invalid refresh token');
          return res.status(403).json({
            success: false,
            error: 'Invalid refresh token',
          });
        }
    
        // Check if token exists in database
        const storedToken = await RefreshToken.findOne({ token: refreshToken });
        if (!storedToken) {
          logger.warn('Refresh token not found in database');
          return res.status(403).json({
            success: false,
            error: 'Invalid refresh token',
          });
        }
    
        // Check if token is expired
        if (new Date() > storedToken.expiresAt) {
          await RefreshToken.deleteOne({ token: refreshToken });
          logger.warn({ userId: storedToken.userId }, 'Refresh token expired');
          return res.status(403).json({
            success: false,
            error: 'Refresh token expired',
          });
        }
    
        // Get user
        const user = await User.findById(storedToken.userId).select('-password');
        if (!user) {
          logger.warn({ userId: storedToken.userId }, 'User not found');
          return res.status(403).json({
            success: false,
            error: 'User not found',
          });
        }
    
        // Generate new tokens
        const accessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
    
        // Delete old refresh token and create new one
        await RefreshToken.deleteOne({ token: refreshToken });
        await RefreshToken.create({
          userId: user._id,
          token: newRefreshToken,
          expiresAt: getTokenExpirationTime(process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
        });
    
        logger.info({ userId: user._id, email: user.email }, 'Tokens refreshed successfully');
    
        // Return response with user data and tokens
        res.status(200).json({
          success: true,
          message: 'Tokens refreshed successfully',
          data: {
            accessToken,
            refreshToken: newRefreshToken
          },
        });
    } catch (error) {
      logger.error({ error }, 'Failed to refresh token');
      res.status(500).json({
        success: false,
        error: 'Failed to refresh token',
      });
    }
  },

  // Logout user and invalidate refresh token
  logout: async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token is required'
        });
      }

      // Delete the refresh token from database
      const deletedToken = await RefreshToken.deleteOne({ token: refreshToken });
      
      if (deletedToken.deletedCount === 0) {
        logger.warn('Attempted to logout with invalid refresh token');
        return res.status(400).json({
          success: false,
          error: 'Invalid refresh token'
        });
      }

      logger.info('User logged out successfully');
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      logger.error({ error }, 'Failed to logout user');
      res.status(500).json({
        success: false,
        error: 'Failed to logout user'
      });
    }
  },

  // Forgot password - send reset email
  forgotPassword: async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email address is required'
        });
      }

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if email exists or not for security
        logger.info({ email }, 'Password reset requested for non-existent email');
        return res.status(200).json({
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent'
        });
      }

      // Check if email is verified
      if (!user.emailVerified) {
        return res.status(400).json({
          success: false,
          error: 'Please verify your email address before resetting your password'
        });
      }

      // Generate secure reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      // Save reset token to database
      const passwordReset = new PasswordReset({
        userId: user._id,
        token: resetToken,
        expiresAt,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      await passwordReset.save();

      // Send reset email
      const emailResult = await emailService.sendPasswordResetEmail(
        user.email,
        resetToken,
        `${user.firstname} ${user.surname}`
      );

      if (!emailResult.success) {
        logger.error({ error: emailResult.error, userId: user._id }, 'Failed to send password reset email');
        return res.status(500).json({
          success: false,
          error: 'Failed to send password reset email. Please try again later.'
        });
      }

      logger.info({ userId: user._id, email: user.email }, 'Password reset email sent successfully');
      
      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });

    } catch (error) {
      logger.error({ error }, 'Failed to process forgot password request');
      res.status(500).json({
        success: false,
        error: 'Failed to process password reset request'
      });
    }
  },

  // Reset password - validate token and update password
  resetPassword: async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Token and new password are required'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters long'
        });
      }

      // Find valid reset token
      const passwordReset = await PasswordReset.findOne({
        token,
        used: false,
        expiresAt: { $gt: new Date() }
      });

      if (!passwordReset) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired reset token'
        });
      }

      // Get user
      const user = await User.findById(passwordReset.userId);
      if (!user) {
        logger.error({ token }, 'User not found for password reset token');
        return res.status(400).json({
          success: false,
          error: 'Invalid reset token'
        });
      }

      // Hash new password
      const hashedPassword = await argon2.hash(newPassword);

      // Update user password
      await User.findByIdAndUpdate(user._id, {
        password: hashedPassword
      });

      // Mark reset token as used
      passwordReset.used = true;
      await passwordReset.save();

      // Send confirmation email
      await emailService.sendPasswordResetConfirmationEmail(
        user.email,
        `${user.firstname} ${user.surname}`
      );

      logger.info({ userId: user._id }, 'Password reset successfully');

      res.status(200).json({
        success: true,
        message: 'Password has been reset successfully'
      });

    } catch (error) {
      logger.error({ error }, 'Failed to reset password');
      res.status(500).json({
        success: false,
        error: 'Failed to reset password'
      });
    }
  },

  // Validate reset token
  validateResetToken: async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Reset token is required'
        });
      }

      // Find valid reset token
      const passwordReset = await PasswordReset.findOne({
        token,
        used: false,
        expiresAt: { $gt: new Date() }
      });

      if (!passwordReset) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired reset token'
        });
      }

      // Get user info (without sensitive data)
      const user = await User.findById(passwordReset.userId).select('firstname surname email');
      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Invalid reset token'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Reset token is valid',
        data: {
          user: {
            firstname: user.firstname,
            lastname: user.surname,
            email: user.email
          }
        }
      });

    } catch (error) {
      logger.error({ error }, 'Failed to validate reset token');
      res.status(500).json({
        success: false,
        error: 'Failed to validate reset token'
      });
    }
  },

  // Resend verification email
  resendVerificationEmail: async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email address is required'
        });
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      if (user.emailVerified) {
        return res.status(400).json({
          success: false,
          error: 'Email is already verified'
        });
      }

      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.verificationToken = verificationToken;
      user.verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      await user.save();

      // Send verification email
      const emailResult = await emailService.sendEmailVerificationEmail(
        user.email,
        verificationToken,
        `${user.firstname} ${user.surname}`
      );

      if (!emailResult.success) {
        logger.error({ error: emailResult.error, userId: user._id }, 'Failed to send verification email');
        return res.status(500).json({
          success: false,
          error: 'Failed to send verification email. Please try again later.'
        });
      }

      logger.info({ userId: user._id }, 'Verification email resent successfully');

      res.status(200).json({
        success: true,
        message: 'Verification email has been sent'
      });

    } catch (error) {
      logger.error({ error }, 'Failed to resend verification email');
      res.status(500).json({
        success: false,
        error: 'Failed to resend verification email'
      });
    }
  }

}