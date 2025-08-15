import { Router } from 'express';
import { getAllMembers, getLoginUser } from '../controllers/userController';
import { verifyJwtMiddleware } from '../utils/jwtHelper';
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

/**
 * @swagger
 * /api/v1/user-info/listing:
 *   get:
 *     summary: show all users
 *     description: All available user in system.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get('/listing', verifyJwtMiddleware, getAllMembers);

export default router;
