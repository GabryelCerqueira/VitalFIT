import type { NextFunction, Request, Response } from 'express';
import { readDatabase } from '../config/database.js';

export type AuthedRequest = Request & { userId: string };

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const auth = req.header('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    next(new Error('AUTH_MISSING'));
    return;
  }

  const token = auth.slice('Bearer '.length).trim();
  const db = await readDatabase();
  const session = db.sessions.find((item) => item.token === token);

  if (!session) {
    next(new Error('AUTH_INVALID'));
    return;
  }

  (req as AuthedRequest).userId = session.userId;
  next();
}
