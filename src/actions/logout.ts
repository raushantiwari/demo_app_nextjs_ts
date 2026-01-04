'use server';
import { ttnFetch } from '@/services/fetch.backend';
import { BACKEND_CONFIG } from '@/utils/backend.constant';
import { getServerCookie, removeServerCookie } from '@/utils/cookies.helper';

export async function removeAuthCookie(name: string) {
  //Get cookie.
  const token = await getServerCookie(name);
  // Call api to logout from server session.
  try {
    await ttnFetch(`${BACKEND_CONFIG.LOGOUT_USER}`, {
      method: 'POST',
      token: token,
      next: { revalidate: 0 },
    });
    // Remove cookies
    await removeServerCookie(name);
    return true;
  } catch (error) {
    console.error(`Backend Service - Logout error :- ${error}`);
    throw new Error(error as string);
  }
}
