import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Extend Express Request type to include `user`
declare module 'express-serve-static-core' {
  interface Request {
    user?: string | JwtPayload;
  }
}

// Middleware to verify JWT token in Authorization header
export function verifyJwtMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization header missing or malformed' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token using secret (ensure JWT_SECRET is defined in env)
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Attach user info to request object for downstream handlers
    req.user = decoded;

    next();
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired' });
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid token' });
    } else {
      console.error('JWT verification failed:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
