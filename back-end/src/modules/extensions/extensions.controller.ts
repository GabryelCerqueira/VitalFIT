import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import { readDatabase, writeDatabase } from '../../config/database.js';
import type { AuthedRequest } from '../../middlewares/auth.middleware.js';
import { installExtensionSchema } from '../../schemas/userSchemas.js';

export async function listExtensions(req: Request, res: Response): Promise<void> {
  const userId = (req as AuthedRequest).userId;
  const db = await readDatabase();
  const installed = new Set(
    db.userExtensions.filter((item) => item.userId === userId).map((item) => item.extensionId),
  );

  res.json(
    db.extensions.map((extension) => ({
      ...extension,
      instalada: installed.has(extension.id),
    })),
  );
}

export async function installExtension(req: Request, res: Response): Promise<void> {
  const parsed = installExtensionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Dados inválidos' });
    return;
  }

  const userId = (req as AuthedRequest).userId;
  const db = await readDatabase();
  const extension = db.extensions.find((item) => item.id === parsed.data.extensionId);

  if (!extension) {
    res.status(404).json({ error: 'Extensão não encontrada' });
    return;
  }

  const alreadyInstalled = db.userExtensions.some(
    (item) => item.userId === userId && item.extensionId === extension.id,
  );

  if (alreadyInstalled) {
    res.status(409).json({ error: 'Extensão já está instalada' });
    return;
  }

  db.userExtensions.push({
    id: crypto.randomUUID(),
    userId,
    extensionId: extension.id,
    installedAt: new Date().toISOString(),
  });
  await writeDatabase(db);

  res.status(201).json({ message: `Extensão ${extension.nome} instalada com sucesso` });
}
