'use server';
import { removeServerCookie } from '@/utils/cookies.helper';

export async function removeAuthCookie() {
  // Call api to logout from server session.

  // Remove cookies
  await removeServerCookie('ttn_token');
}
