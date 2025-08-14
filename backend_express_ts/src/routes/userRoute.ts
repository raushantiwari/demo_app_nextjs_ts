import { Router } from 'express';
import { getLoginUser } from '../controllers/userController';
import { verifyJwtMiddleware } from '../middlewares/jwtAuthVerify';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();

/**
 * @swagger
 * /api/v1/user-info:
 *   get:
 *     summary: Get logged-in user information
 *     description: Logged in user information.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get('/', verifyJwtMiddleware, getLoginUser);

export default router;
