import Cookies from 'js-cookie';
/**
 * Get cookies from client side
 * @param cookieName
 * @returns
 * example of uses:   const token = getClientCookie('token');
 */
export function getClientCookie(cookieName: string): string | undefined {
  return Cookies.get(cookieName);
}

type CookieOptions = {
  expires?: number | Date; // e.g., 7 for 7 days
  path?: string; // default '/'
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean; // true in production for https
};

/**
 * Set cookies from client component
 * @param name
 * @param value
 * @param options
 * exmple of uses: setClientCookie('token', 'abc123', { expires: 1 / 24 }); // 1 hour
 */

export function setClientCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
) {
  Cookies.set(name, value, {
    expires: options.expires ?? 7, // default expires in 7 days
    path: options.path ?? '/',
    sameSite: options.sameSite ?? 'lax',
    secure: options.secure ?? process.env.NODE_ENV === 'production',
  });
}

/**
 * Remove cookies from client component.
 * @param name
 * example of uses: deleteClientCookie('token');
 */
export function deleteClientCookie(name: string) {
  Cookies.remove(name);
}
