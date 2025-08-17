import { Request, Response } from 'express';
import { verifyToken } from '../utils/jwtHelper';
import User from '../models/User';
import { ResponseHelper } from '../utils/responseHelper';
import { UserAddressProp, UserProfileProp } from '../types/users.type';
import Profile from '../models/Profile';

/**
 * Get logged in user information based on token only
 * @param req
 * @param res
 * @returns
 */
export const getLoginUser = async (req: Request, res: Response) => {
  try {
    const decoded = verifyToken(req);
    console.log(decoded, 'decodeToken@@@@@@@@@@@@@@@');

    if (!decoded.email) {
      return ResponseHelper.badRequest(res, 'Your token is invalid.');
    }

    const user = await User.getUserById(decoded.email);

    if (user && Object.keys(user).length > 0) {
      return ResponseHelper.success(res, user, 'Record fetched successfully.');
    } else {
      return ResponseHelper.notFound(res, 'No record found.');
    }
  } catch (error) {
    console.error('Error fetching login user:', error);
    return ResponseHelper.unauthorized(res, 'Invalid or expired token');
  }
};

/**
 * Get all users listing: based on status. default all will be show.
 * @param req
 * @param res
 * @returns
 */
export const getAllMembers = async (req: Request, res: Response) => {
  try {
    const decoded = verifyToken(req);

    // Get status from body header.
    const { status } = req.body ?? {};
    if (!decoded.email) {
      return ResponseHelper.badRequest(res, 'Your token is invalid.');
    }

    // Get users.
    const users =
      status === undefined ? await User.getUserListing() : await User.getUserListing(status);

    if (users && users.length > 0) {
      return ResponseHelper.success(res, users, 'Record fetched successfully.');
    } else {
      return ResponseHelper.notFound(res, 'No record found.');
    }
  } catch (error) {
    console.error('Error fetching login user:', error);
    return ResponseHelper.unauthorized(res, 'Invalid or expired token');
  }
};

/**
 * Get member profile.
 * @param req
 * @param res
 * @returns
 */
export const getProfileInfo = async (req: Request, res: Response) => {
  try {
    const decoded = verifyToken(req);
    if (!decoded.email) {
      return ResponseHelper.badRequest(res, 'Your token is invalid.');
    }
    const id = req.params.id ? parseInt(req.params.id) : 0;
    // Get users.
    const users = await User.getMemberProfile(id);
    if (users && users.length > 0) {
      return ResponseHelper.success(res, users, 'Record fetched successfully.');
    } else {
      return ResponseHelper.notFound(res, 'No record found.');
    }
  } catch (error) {
    console.error('Error fetching login user:', error);
    return ResponseHelper.unauthorized(res, 'Invalid or expired token');
  }
};

/**
 * Get member profile.
 * @param req
 * @param res
 * @returns
 */
export const updateUserAddress = async (req: Request, res: Response) => {
  try {
    const decoded = verifyToken(req);
    if (!decoded.email) {
      return ResponseHelper.badRequest(res, 'Your token is invalid.');
    }
    // Get status from body header.
    const bodyAdd: UserAddressProp = req.body ?? {};
    bodyAdd.email = decoded?.email;
    bodyAdd.user_id = String(decoded?.id);
    // Get users.
    const users = await User.upsertUserAddress(bodyAdd);
    if (users && Object.keys(users).length > 0) {
      return ResponseHelper.success(res, users, 'Record fetched successfully.');
    } else {
      return ResponseHelper.notFound(res, 'No record found.');
    }
  } catch (error) {
    console.error('Error fetching login user:', error);
    return ResponseHelper.unauthorized(res, 'Invalid or expired token');
  }
};

/**
 * Get member profile.
 * @param req
 * @param res
 * @returns
 */
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const decoded = verifyToken(req);
    if (!decoded.email) {
      return ResponseHelper.badRequest(res, 'Your token is invalid.');
    }
    // Get status from body header.
    const bodyAdd: UserProfileProp = req.body ?? {};
    bodyAdd.email = decoded?.email;
    bodyAdd.user_id = Number(decoded?.id);
    // Get users.
    const users = await Profile.upsertUserProfile(bodyAdd);
    if (users && Object.keys(users).length > 0) {
      return ResponseHelper.success(res, users, 'Record fetched successfully.');
    } else {
      return ResponseHelper.notFound(res, 'No record found.');
    }
  } catch (error) {
    console.error('Error fetching login user:', error);
    return ResponseHelper.unauthorized(res, 'Invalid or expired token');
  }
};
