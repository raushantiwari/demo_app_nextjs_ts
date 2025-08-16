import { Request, Response } from 'express';
import dotenv from 'dotenv';
// import { verifyToken } from '../utils/jwtHelper';
import { ResponseHelper } from '../utils/responseHelper';
import User from '../models/User';
import { BasicUserProp } from '../types/users.type';
import { isValidEmail } from '../utils/helper';
import Profile from '../models/Profile';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // higher = stronger but slower

dotenv.config();

/**
 * Hash password before saving to DB
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare raw password with hashed password
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Logout function
 * @param req
 * @param res
 * @param token
 * @returns
 */
export const userLogoutDb = async (req: Request, res: Response, token: string) => {
  try {
    await User.deleteSessionToken(token);
  } catch (error) {
    console.error('Error fetching login user:', error);
    return ResponseHelper.unauthorized(res, 'Invalid or expired token');
  }
};

/**
 * Create user to help of basic auth setup.
 * @param req
 * @param res
 * @returns
 */
export const basicUserCreate = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return ResponseHelper.unauthorized(
      res,
      'You are already logged-in, logout first to access this !',
    );
  }
  try {
    const { email, first_name, last_name, password, confirm_password }: BasicUserProp =
      req.body ?? {};

    // check valid email.
    if (email) {
      if (!isValidEmail(email)) {
        return ResponseHelper.badRequest(res, 'Invalid email adress');
      }
    } else {
      return ResponseHelper.badRequest(res, 'email adress is required');
    }

    // check passord match or not.
    if (password || confirm_password) {
      if (password !== confirm_password) {
        return ResponseHelper.badRequest(res, 'password and confirm password should be match.');
      }
    } else {
      return ResponseHelper.badRequest(res, 'password or confim password is required.');
    }
    // Check user exist or not.
    const userExist = await User.checkUserExists(email);
    if (userExist && userExist?.email) {
      return ResponseHelper.unauthorized(res, 'User already exist, use diffrent email.');
    }
    // create user.
    const userParams = {
      google_id: `dummy_basic_auth_${Date.now()}`,
      email: email,
      password: password ? await hashPassword(password) : '',
      name: `${first_name} ${last_name}`,
    };
    const userInfo = await User.createUser(userParams);
    // Create user Profile.
    await Profile.createUserProfile({
      user_id: userInfo.id,
      email: userInfo.email,
      first_name: first_name,
      last_name: last_name,
      avatar: '',
      phone: '',
      bio: '',
      social_fb: '',
      social_linkdin: '',
      social_insta: '',
    });

    // Delete variable from object for security reasons.
    delete userInfo.password;
    delete userInfo.google_id;

    return ResponseHelper.success(res, userInfo, 'User Registered successfully.');
  } catch (error) {
    console.error('Error fetching login user:', error);
    return ResponseHelper.unauthorized(res, 'error occoured to basicUserCreate.');
  }
};
