import { Router } from 'express';
import {
  getAllMembers,
  getLoginUser,
  getProfileInfo,
  updateUserAddress,
} from '../controllers/userController';
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

/**
 * @swagger
 * /api/v1/user-info/update-address:
 *   post:
 *     summary: User address update.
 *     description: Add or update user address based on token.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - country
 *               - state
 *               - city
 *               - postal
 *             properties:
 *               country:
 *                 type: string
 *                 example: "India"
 *               state:
 *                 type: string
 *                 example: "UP"
 *               city:
 *                 type: string
 *                 example: "Noida"
 *               postal:
 *                 type: string
 *                 example: "203207"
 *     responses:
 *       200:
 *         description: Address created successfully
 *       400:
 *         description: Bad request
 */
router.post('/update-address', verifyJwtMiddleware, updateUserAddress);

export default router;
