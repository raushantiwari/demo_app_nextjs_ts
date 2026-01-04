import { setOrUpdateCookie } from '@/utils/cookies.helper';

export async function GET(request: Request) {
  // Parse the URL from the request
  const url = new URL(request.url);
  // Get search params object
  const searchParams = url.searchParams;

  // Example: get single param by name
  const token = searchParams.get('token');
  if (token) {
    // Example: Set token as httpOnly cookie
    await setOrUpdateCookie('ttn_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600, // 1 hour in seconds
      sameSite: 'lax',
    });
    return Response.redirect(new URL('/members', request.url));
  } else {
    console.log('not logged in', '@@@@@@@@@@@@@@22');
    return Response.redirect(new URL('/signin', request.url));
  }
  // Use params for your logic or fetching data
  // return new Response.redirect(JSON.stringify({ token }), {
  //   status: 200,
  //   headers: { 'Content-Type': 'application/json' },
  // });
}
