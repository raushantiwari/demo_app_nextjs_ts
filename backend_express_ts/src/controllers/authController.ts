import { Request, Response } from 'express';
import dotenv from 'dotenv';
// import { verifyToken } from '../utils/jwtHelper';
import { ResponseHelper } from '../utils/responseHelper';
import User from '../models/User';

dotenv.config();

export const userLogoutDb = async (req: Request, res: Response, token: string) => {
  try {
    await User.deleteSessionToken(token);
  } catch (error) {
    console.error('Error fetching login user:', error);
    return ResponseHelper.unauthorized(res, 'Invalid or expired token');
  }
};
