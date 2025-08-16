import { Router } from 'express';

import dotenv from 'dotenv';
import { basicUserCreate, basicUserLogin } from '../controllers/authController';
dotenv.config();

const router = Router();

/**
 * @swagger
 * /api/v1/auth/basic/register:
 *   post:
 *     summary: Basic auth setup to create user.
 *     description: Setup basic auth to create user.
 *     tags:
 *       - Basic Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *               - confirm_password
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "jone"
 *               last_name:
 *                 type: string
 *                 example: "adams"
 *               email:
 *                 type: string
 *                 example: "jhon@edu.com"
 *               password:
 *                 type: string
 *                 example: "ttn@!@#$"
 *               confirm_password:
 *                 type: string
 *                 example: "ttn@!@#$"
 *     responses:
 *       200:
 *         description: Setup basic auth to user create.
 *       400:
 *         description: Bad request
 */

router.post('/register', basicUserCreate);

/**
 * @swagger
 * /api/v1/auth/basic/login:
 *   post:
 *     summary: Basic auth setup to user login.
 *     description: Setup basic auth to user login.
 *     tags:
 *       - Basic Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "jhon@edu.com"
 *               password:
 *                 type: string
 *                 example: ""
 *     responses:
 *       200:
 *         description: Setup basic auth to user login.
 *       400:
 *         description: Bad request
 */

router.post('/login', basicUserLogin);

export default router;
