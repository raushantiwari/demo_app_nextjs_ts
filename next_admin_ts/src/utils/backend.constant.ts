export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const apiPrefix = '/api/v1';

export const BACKEND_CONFIG = {
  LOGOUT_USER: `${apiPrefix}/auth/google/logout`,
  LOGIN_API: `${apiPrefix}/auth/basic/login`,
  REGISTER_API: `${apiPrefix}/auth/basic/register`,
  BASIC_USER_INFO: `${apiPrefix}/user-info`,
  USER_LISTING_INFO: `${apiPrefix}/user-info/listing`,
} as const;

export type BconfigType = typeof BACKEND_CONFIG;
