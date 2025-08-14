import { Request, Response, Router } from 'express';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();

// Google Login Route
router.get('/', async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.checkUserExists(email);
  if (user) {
    res.json({
      status: 200,
      message: 'Record fetch successfully.',
      data: user,
    });
  } else {
    res.json({ status: 404, message: 'No record found.', data: [] });
  }
});

export default router;
