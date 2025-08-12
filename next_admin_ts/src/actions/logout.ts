'use server';
import { removeServerCookie } from '@/utils/cookies.helper';

export async function removeAuthCookie(name: string) {
  // Call api to logout from server session.

  // Remove cookies
  await removeServerCookie(name);
}
