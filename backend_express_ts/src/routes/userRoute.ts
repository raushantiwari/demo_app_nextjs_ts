import { Router } from 'express';
import {
  getAllMembers,
  getLoginUser,
  getProfileInfo,
  updateUserAddress,
  updateUserProfile,
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

/**
 * @swagger
 * /api/v1/user-info/profile/update:
 *   post:
 *     summary: User profile update.
 *     description: Add or update user profile based on token.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - phone
 *               - bio
 *               - social_fb
 *               - social_linkdin
 *               - social_insta
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "jone"
 *               last_name:
 *                 type: string
 *                 example: "adams"
 *               phone:
 *                 type: string
 *                 example: "9990016334"
 *               bio:
 *                 type: string
 *                 example: "Fullstack developer"
 *               social_fb:
 *                 type: string
 *                 example: "https://fb.com/raushan"
 *               social_linkdin:
 *                 type: string
 *                 example: "https://linkdin.com/raushan"
 *               social_insta:
 *                 type: string
 *                 example: "https://insta.com/raushan"
 *     responses:
 *       200:
 *         description: Profile created successfully
 *       400:
 *         description: Bad request
 */

router.post('/profile/update', verifyJwtMiddleware, updateUserProfile);

export default router;
