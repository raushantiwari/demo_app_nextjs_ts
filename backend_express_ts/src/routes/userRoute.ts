import { Router } from 'express';
import { getAllMembers, getLoginUser, getProfileInfo } from '../controllers/userController';
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

/**
 * @swagger
 * /api/v1/user-info/profile/{id}:
 *   get:
 *     summary: Get user profile information based on ID.
 *     description: Profile information based on provided ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to get profile.
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/profile/:id', verifyJwtMiddleware, getProfileInfo);

export default router;
