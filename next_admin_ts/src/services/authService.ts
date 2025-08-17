'use server';
import { BACKEND_CONFIG } from '@/utils/backend.constant';
import { ttnFetch } from './fetch.backend';
import { LoginAuthProp } from '@/types/auth.type';

type LoginAuthProps = {
  email?: string;
  password?: string;
};

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
