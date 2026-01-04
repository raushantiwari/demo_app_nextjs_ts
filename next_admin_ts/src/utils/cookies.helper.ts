'use server';
import { cookies } from 'next/headers';

/**
 * Get cookies from server side
 * @param cookieName
 * @returns
 * Example of uses: const token = await getServerCookie('token');
 */
export async function getServerCookie(
  cookieName: string,
): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(cookieName)?.value;
}
/**
 * Set or update cookies server side.
 * @param name 
 * @param value 
 * @param options 
 * 
 * Example of uses:
      await setOrUpdateCookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600, // 1 hour in seconds
        sameSite: 'lax'
      });
 */
export async function setOrUpdateCookie(
  name: string,
  value: string,
  options?: {
    maxAge?: number; // seconds
    path?: string;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
  },
) {
  const cookieStore = await cookies(); // Await this

  cookieStore.set({
    name,
    value,
    maxAge: options?.maxAge ?? 60 * 60 * 24, // default 1 hour
    path: options?.path ?? '/',
    httpOnly: options?.httpOnly ?? true,
    secure: options?.secure ?? process.env.NODE_ENV === 'production',
    sameSite: options?.sameSite ?? 'lax',
  });
}

/**
 * Remove cookies from server component.
 * @param name
 * example of uses: await removeServerCookie("token");
 */

export async function removeServerCookie(name: string) {
  const cookieStore = await cookies();

  // Option 1: Using delete() if available
  if (typeof cookieStore.delete === 'function') {
    cookieStore.delete(name);
  } else {
    // Option 2: Set the cookie with an expired date to remove
    cookieStore.set({
      name,
      value: '',
      path: '/',
      maxAge: 0, // Expire immediately
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }
}
