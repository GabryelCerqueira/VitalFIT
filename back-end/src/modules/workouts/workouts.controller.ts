import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import { readDatabase, writeDatabase } from '../../config/database.js';
import type { AuthedRequest } from '../../middlewares/auth.middleware.js';
import { createWorkoutSchema } from '../../schemas/userSchemas.js';
import type { Workout } from '../../types/domain.js';

export async function listWorkouts(req: Request, res: Response): Promise<void> {
  const userId = (req as AuthedRequest).userId;
  const db = await readDatabase();
  const workouts = db.workouts.filter((item) => item.userId === userId);
  res.json(workouts);
}

export async function createWorkout(req: Request, res: Response): Promise<void> {
  const parsed = createWorkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Dados inválidos' });
    return;
  }

  const userId = (req as AuthedRequest).userId;
  const db = await readDatabase();
  const workout: Workout = {
    id: crypto.randomUUID(),
    userId,
    ...parsed.data,
    createdAt: new Date().toISOString(),
  };

  db.workouts.push(workout);
  await writeDatabase(db);
  res.status(201).json(workout);
}
