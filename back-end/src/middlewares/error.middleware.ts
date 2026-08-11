import type { NextFunction, Request, Response } from 'express';

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof Error && error.message === 'AUTH_MISSING') {
    res.status(401).json({ error: 'Token de autenticação ausente' });
    return;
  }

  if (error instanceof Error && error.message === 'AUTH_INVALID') {
    res.status(401).json({ error: 'Token inválido' });
    return;
  }

  console.error(error);
  res.status(500).json({ error: 'Erro interno do servidor' });
}
