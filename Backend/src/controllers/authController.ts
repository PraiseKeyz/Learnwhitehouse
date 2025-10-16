import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/user';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import bcrypt from "bcryptjs";

dotenv.config();

interface UserBody {
    _id: string;
    password: string;
    verified: boolean;
    toObject: () => Record<string, any>;
}

interface CustomRequest extends Request {
    user?: {
        _id: string;
        role?: string;
    };
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
    },
});

async function sendVerificationEmail(email: string, token: string, route: string): Promise<void> {
    try {
        const verificationLink = `https://learnwhitehouse.com/${route}?token=${token}`;

        // Email options
        const mailOptions = {
            from: `"LearnWhitehouse" <${process.env.USER_EMAIL}>`,
            to: email, 
            subject: 'LearnWhitehouse - Verify Your Email',
            html: `<p>Thank you for registering with LearnWhitehouse! Please click the following link to verify your email address:</p><a href="${verificationLink}">${verificationLink}</a>`,
        };

        // Send Email
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw error; 
    }
}


// Signup logic
export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = new User(req.body);
        if (!user) {
            res.status(400).json({ message: "Missing fields required" });
            return;
        }
        const {email} = user
        const existingUser = await User.findOne({email})

        if(existingUser) {
            res.status(400).json({message: "Email already registered"})
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(user.password, salt);


        const verificationToken = crypto.randomBytes(32).toString('hex');

        user.verificationToken = verificationToken
        user.password = passwordHash
        await user.save();
        const token = jwt.sign(
            { _id: (user._id as string).toString() },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );
        const { password: _, ...isWithoutPassword } = user.toObject();

        const route = "verify-email"
        await sendVerificationEmail(email, verificationToken, route);

        res.status(201).json({ message: "New account created", user: isWithoutPassword, token });
    }
    catch (error) {
        console.error("Error signing up:", error);
        res.status(400).json({ error: "Failed to signup an account" });
    }
};

// verify user email function
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.query;
  
      if (!token) {
        res.status(400).json({ message: 'Verification token is required' });
        return
      }

      const user = await User.findOne({ verificationToken: token, verified: false });
  
      if (!user) {
        res.status(400).json({ message: 'Invalid or expired verification token' });
        return
      }
  
      user.verified = true;
      user.verificationToken = null;  // Token is now invalid
      await user.save();
  
      res.status(200).json({ message: 'Email verified successfully!' });
  
    } catch (error) {
      console.error("Email verification failed:", error);
      res.status(500).json({ message: 'Email verification failed' });
    }
  };

  export const resendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email} = req.body;
        if (!email) {
            res.status(400).json({ message: "Email is required" });
            return;
        }
        const existingUser = await User.findOne({ email });
    
        if (!existingUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
    
        const verificationToken = crypto.randomBytes(32).toString('hex'); 
        existingUser.verificationToken = verificationToken;
        await existingUser.save()

        const route = "verify-email"
        await sendVerificationEmail(email, verificationToken, route);
    
    
        res.status(200).json({ message: "Verification email resent successfully" });
    } catch (error) {
        console.error("Error resending verification email:", error);
        res.status(500).json({ message: "Failed to resend verification email" })
    }
  }

// Login logic
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }) as UserBody;
        if (!user) {
            throw new Error('Invalid credentials');
        }
        if (user.verified === false) {
            res.status(401).json({message: "User is not verified"})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Password is incorrect');
        }
        const { password: _, ...isWithoutPassword } = user.toObject();
        const token = jwt.sign(
            { _id: user._id.toString() },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );
        res.status(201).json({ message: "Logged in successfully", user: isWithoutPassword, token });
    }
    catch (error) {
        console.error("Error logging in:", error);
        res.status(400).json({ error: "Failed to login" });
    }
};

// get user profile logic
export const getUserProfile = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id
        
        const user = await User.findById(userId).select("-password")
        if(!user) {
            res.status(404).json({error: "User not found"})
            return
        }
        res.status(200).json(user)
    }
    catch(error) {
        console.error(error)
        res.status(500).json({error: "Internal server error"})
    }
}

// get all users
export const getallUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const allUsers = await User.find()
        res.status(200).json(allUsers)
    }
    catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({error: "Internal server error"})
    }
}

// create admin logic
export const promoteUserToAdmin = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }

        if (!req.user?._id) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }

        const updatedUser = await User.promoteToAdmin(userId, req.user._id);
        
        // Remove sensitive data before sending response
        const { password: _, adminSecretKey: __, ...userWithoutSensitiveData } = updatedUser.toObject();

        res.status(200).json({
            message: "User successfully promoted to admin",
            user: userWithoutSensitiveData
        });
    } catch (error) {
        console.error("Error promoting user to admin:", error);
        res.status(400).json({ 
            error: (error as Error).message || "Failed to promote user to admin"
        });
    }
};

// forget password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email} = req.body
        if(!email) {
            res.status(400).json({message: "Email required"})
        }

        const existingUser = await User.findOne({ email })

        if(!existingUser) {
            res.status(404).json({message: "User not found"})
            return
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        existingUser.verificationToken = resetToken;
        await existingUser.save()
        
        const route = "reset-password"; 
        sendVerificationEmail(email, resetToken, route)

        res.status(200).json({message: "Check your email for steps on how to reset your password"})
    } catch(error) {
        console.error("Error requesting password reset:", error);
        res.status(500).json({error: "Internal server error"})
    }
}

// reset password logic
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, newPassword } = req.body

        if (!token || !newPassword) {
         res.status(400).json({ message: "Token and new password are required" });
         return
        }

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            res.status(400).json({ message: "Invalid or expired reset token" });

            return 
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword; // update user
        user.verificationToken = null;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Failed to reset password" });
    }
};