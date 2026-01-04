import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define your app routes
const PUBLIC_ROUTES = ['/', '/signin', '/signup'];
const PROTECTED_ROUTES = ['/members', '/profile', '/members/*'];

// Convert routes matcher helper
function pathnameStartsWith(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );
}

// Async function to verify the JWT token.
// No secret key is needed for this; only for cryptographic verification or trust checks.
// To check if a token is a JWT, ensure it has three dot-separated parts and is base64url-encoded into valid JSON for header and payload.

function isJWT(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  try {
    const header = JSON.parse(
      atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')),
    );
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')),
    );
    return typeof header === 'object' && typeof payload === 'object';
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API, and _next assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = pathnameStartsWith(pathname, PUBLIC_ROUTES);
  const isProtectedRoute = pathnameStartsWith(pathname, PROTECTED_ROUTES);

  // Get your JWT token from cookie (or wherever you store it)
  const token = request.cookies.get('ttn_token')?.value;
  const decodedToken = token ? isJWT(token) : null;

  const redirectTo = (url: string) =>
    NextResponse.redirect(new URL(url, request.url));

  // Require authenticated user for protected routes
  if (isProtectedRoute && !decodedToken) {
    return redirectTo('/signin');
  }

  // Redirect logged-in users away from public auth routes
  if (isPublicRoute && decodedToken) {
    return redirectTo('/members');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)'],
};
