import { Request, Response } from 'express';
import { verifyToken } from '../utils/jwtHelper';
import User from '../models/User';

export const getLoginUser = async (req: Request, res: Response) => {
  try {
    const decoded = verifyToken(req);

    if (!decoded.email) {
      return res.status(400).json({ status: 400, message: 'Your token is invalid.' });
    }

    const user = await User.getUserById(decoded.email);

    if (user) {
      return res.json({
        status: 200,
        message: 'Record fetched successfully.',
        data: user,
      });
    } else {
      return res.status(404).json({ status: 404, message: 'No record found.', data: [] });
    }
  } catch (error) {
    console.error('Error fetching login user:', error);
    return res.status(401).json({ status: 401, message: 'Invalid or expired token' });
  }
};
