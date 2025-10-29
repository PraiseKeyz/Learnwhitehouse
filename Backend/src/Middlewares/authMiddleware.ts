import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/user.model';
import dotenv from 'dotenv';

dotenv.config();

// Extend Express Request type to include our custom properties
interface CustomRequest extends Request {
    token?: string;
    user?: any; // {
    //    _id: string;
     //   role?: string;
  //  };
}

const auth = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { _id: string };
        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        req.token = token;
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Please authenticate..." });
    }
};

export default auth;