'use server';
import { BACKEND_CONFIG } from '@/utils/backend.constant';
import { ttnFetch } from './fetch.backend';
import { BasicUserProp } from '@/types/member.type';
import { getServerCookie } from '@/utils/cookies.helper';

/**
 * Login service
 * @param param0
 * @returns
 */
export async function basicUserService(): Promise<BasicUserProp | undefined> {
  try {
    const tokenInfo = await getServerCookie('ttn_token');
    const response = await ttnFetch(`${BACKEND_CONFIG.BASIC_USER_INFO}`, {
      method: 'GET',
      token: tokenInfo ?? '',
    });
    if (!response.ok) {
      console.error(
        `getDatasheetDetails ${BACKEND_CONFIG.BASIC_USER_INFO} Status-Code: ${response.status}: Network response was not ok`,
      );
    }
    if (response) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error(`Backend Service - Login failed :- ${error}`);
    throw new Error(error as string);
  }
}
