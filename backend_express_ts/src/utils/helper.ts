import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export interface DecodedToken extends JwtPayload {
  email?: string;
  // Add other claims your token may have
}

export function getDecodedToken(req: Request): DecodedToken {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: No token provided or invalid format');
  }

  const token = authHeader.split(' ')[1];

  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
  } catch {
    throw new Error('Unauthorized: Invalid or expired token');
  }
}

export function formatQueryForDebug(query: string, params: unknown[]): string {
  return query.replace(/\$(\d+)/g, (_, idx) => {
    const val = params[idx - 1];
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'string') {
      // Escape single quotes in string
      return `'${val.replace(/'/g, "''")}'`;
    }
    if (val instanceof Date) {
      return `'${val.toISOString()}'`;
    }
    return val.toString();
  });
}
