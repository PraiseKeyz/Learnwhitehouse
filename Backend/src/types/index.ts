import { Request, Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
  timestamp?: string;
  version?: string;
}

export type AsyncHandler = (req: Request, res: Response) => Promise<void>;

export interface AuthenticatedUser {
  _id: string;
  role: string;
  accountType: string;
}
