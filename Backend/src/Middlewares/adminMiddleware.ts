import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
    user?: {
        role?: string;
    };
}

const isAdmin = (req: CustomRequest, res: Response, next: NextFunction): void => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ message: "Access denied. Admins only." });
        return;
    }
    next();
};

export default isAdmin;