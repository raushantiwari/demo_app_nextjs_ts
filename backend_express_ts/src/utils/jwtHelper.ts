// utils/jwtUtils.ts
import jwt, { JwtPayload, SignOptions, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export interface JwtPayloadCustom extends JwtPayload {
  id?: number;
  email?: string;
  role?: string;
  [key: string]: unknown; // allow extra claims
}

/**
 * Create a signed JWT token
 */
export function createLoginToken(
  payload: JwtPayloadCustom,
  expiresIn: SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) ??
    '1h',
  options: Partial<SignOptions> = {},
): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in environment variables');
  }

  const defaultOptions: SignOptions = {
    expiresIn,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    algorithm: 'HS256',
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { ...defaultOptions, ...options });
}

/**
 * verify token from Authorization header.
 */
export function verifyToken(req: Request): JwtPayloadCustom {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: No token provided or invalid format');
  }

  const token = authHeader.split(' ')[1];

  return jwt.verify(token, process.env.JWT_SECRET!, {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    algorithms: ['HS256'],
  }) as JwtPayloadCustom;
}

/**
 * Middleware to verify JWT token in Authorization header
 */
export function verifyJwtMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const decoded = verifyToken(req);
    req.user = decoded; // attach to request
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({ status: 401, message: 'Token expired' });
    } else if (err instanceof JsonWebTokenError) {
      res.status(401).json({ status: 401, message: 'Invalid token' });
    } else {
      res.status(401).json({ status: 401, message: (err as Error).message ?? 'Unauthorized' });
    }
  }
}
