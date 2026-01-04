'use server';
import { BACKEND_CONFIG } from '@/utils/backend.constant';
import { ttnFetch } from './fetch.backend';
import { BasicUserProp, MemberListingProp, MemberProfileProp } from '@/types/member.type';
import { getServerCookie } from '@/utils/cookies.helper';

/**
 * basic user service
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
        `basicUserService ${BACKEND_CONFIG.BASIC_USER_INFO} Status-Code: ${response.status}: Network response was not ok`,
      );
    }
    if (response) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error(`Backend Service - basicUserService :- ${error}`);
    throw new Error(error as string);
  }
}

/**
 * User listing service
 * @param param0
 * @returns
 */
export async function userListingService(): Promise<
  MemberListingProp | undefined
> {
  try {
    const tokenInfo = await getServerCookie('ttn_token');
    const response = await ttnFetch(`${BACKEND_CONFIG.USER_LISTING_INFO}`, {
      method: 'GET',
      token: tokenInfo ?? '',
    });
    if (!response.ok) {
      console.error(
        `userListingService ${BACKEND_CONFIG.USER_LISTING_INFO} Status-Code: ${response.status}: Network response was not ok`,
      );
    }
    if (response) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error(`Backend Service - userListingService :- ${error}`);
    throw new Error(error as string);
  }
}

/**
 * Member profile service
 * @param param0
 * @returns
 */
export async function userProfileInfoService(
  id: string,
): Promise<MemberProfileProp | undefined> {
  try {
    const tokenInfo = await getServerCookie('ttn_token');
    const response = await ttnFetch(`${BACKEND_CONFIG.USER_PROFILE_INFO}/${id}`, {
      method: 'GET',
      token: tokenInfo ?? '',
    });
    if (!response.ok) {
      console.error(
        `userProfileInfoService ${BACKEND_CONFIG.USER_PROFILE_INFO} Status-Code: ${response.status}: Network response was not ok`,
      );
    }
    if (response) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error(`Backend Service - userProfileInfoService :- ${error}`);
    throw new Error(error as string);
  }
}
