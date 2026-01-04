'use server';

import jwt, { JwtPayload } from 'jsonwebtoken';

/**
 * JWT Payload structure
 */
export interface MyJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Verify and decode a JWT token
 * @param token
 * @returns Decoded payload if valid, otherwise throws an error
 */
export async function verifyToken(token: string): Promise<MyJwtPayload> {
  const secret = process.env.NEXT_JWT_SECRET;
  if (!secret) {
    throw new Error('NEXT_JWT_SECRET is not defined');
  }

  try {
    return jwt.verify(token, secret) as MyJwtPayload;
  } catch (error) {
    console.log(error, 'Error in decode token');
    throw new Error('Invalid or expired token');
  }
}
