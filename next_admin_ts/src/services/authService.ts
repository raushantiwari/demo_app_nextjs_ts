'use server';
import { BACKEND_CONFIG } from '@/utils/backend.constant';
import { ttnFetch } from './fetch.backend';
import {
  LoginAuthProp,
  RegisterAuthProp,
  RegisterFormValues,
} from '@/types/auth.type';

type LoginAuthProps = {
  email?: string;
  password?: string;
};

/**
 * Login service
 * @param param0
 * @returns
 */
export async function loginAuthService({
  email,
  password,
}: LoginAuthProps): Promise<LoginAuthProp | undefined> {
  try {
    const response = await ttnFetch(`${BACKEND_CONFIG.LOGIN_API}`, {
      method: 'POST',
      body: JSON.stringify({ email: email, password: password }),
    });
    if (!response.ok) {
      console.error(
        `getDatasheetDetails ${BACKEND_CONFIG.LOGIN_API} Status-Code: ${response.status}: Network response was not ok`,
      );
    }
    if (response && response.status === 200) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error(`Backend Service - Login failed :- ${error}`);
    throw new Error(error as string);
  }
}

/**
 * Register inforamtion
 * @param registerInfo
 * @returns
 */

export async function registerAuthService(
  registerInfo: RegisterFormValues,
): Promise<RegisterAuthProp | undefined> {
  try {
    const response = await ttnFetch(`${BACKEND_CONFIG.REGISTER_API}`, {
      method: 'POST',
      body: JSON.stringify(registerInfo),
    });
    if (!response.ok) {
      console.error(
        `getDatasheetDetails ${BACKEND_CONFIG.REGISTER_API} Status-Code: ${response.status}: Network response was not ok`,
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Backend Service - Register failed :- ${error}`);
    throw new Error(error as string);
  }
}
