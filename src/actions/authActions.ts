'use server';

import { loginAuthService, registerAuthService } from '@/services/authService';
import { setOrUpdateCookie } from '@/utils/cookies.helper';
import {
  LoginAuthProp,
  RegisterAuthProp,
  RegisterFormValues,
} from '@/types/auth.type';
import { LoginFormValues } from '@/components/auth/SignInForm';

export async function loginAuthAction(data: LoginFormValues) {
  const response: LoginAuthProp = await loginAuthService(data).catch(
    (error) => {
      return error;
    },
  );
  // set cookies after successfull login.
  if (response && response?.data) {
    await setOrUpdateCookie('ttn_token', response?.data, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600, // 1 hour in seconds
      sameSite: 'lax',
    });
  }

  return response;
}

export async function registerAuthAction(data: RegisterFormValues) {
  const response: RegisterAuthProp = await registerAuthService(data).catch(
    (error) => {
      return error;
    },
  );
  // set cookies after successfull login.
  if (response && response?.data && Object.keys(response?.data).length > 0) {
    if (response?.data?.token) {
      await setOrUpdateCookie('ttn_token', response?.data?.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600, // 1 hour in seconds
        sameSite: 'lax',
      });
    }
  }

  return { status: response?.status, message: response?.message };
}
