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

export async function listCommunityWorkouts(_req: Request, res: Response): Promise<void> {
  const db = await readDatabase();
  const community = db.workouts.filter((item) => Boolean(item.publico));
  res.json(community);
}

export async function createWorkout(req: Request, res: Response): Promise<void> {
  const parsed = createWorkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Dados inválidos' });
    return;
  }

  const userId = (req as AuthedRequest).userId;
  const db = await readDatabase();
  const user = db.users.find((u) => u.id === userId);

  const workout: Workout = {
    id: crypto.randomUUID(),
    userId,
    ...parsed.data,
    concluido: false,
    publico: false,
    autorNome: user?.nome ?? 'Atleta VitalFIT',
    copias: 0,
    createdAt: new Date().toISOString(),
  };

  db.workouts.push(workout);
  await writeDatabase(db);
  res.status(201).json(workout);
}

export async function toggleShareWorkout(req: Request, res: Response): Promise<void> {
  const workoutId = req.params.id;
  const userId = (req as AuthedRequest).userId;
  const db = await readDatabase();
  const user = db.users.find((u) => u.id === userId);

  const workout = db.workouts.find((w) => w.id === workoutId && w.userId === userId);
  if (!workout) {
    res.status(404).json({ error: 'Treino não encontrado' });
    return;
  }

  workout.publico = !workout.publico;
  if (workout.publico && !workout.autorNome) {
    workout.autorNome = user?.nome ?? 'Atleta VitalFIT';
  }

  await writeDatabase(db);
  res.json({
    message: workout.publico
      ? 'Treino compartilhado com a comunidade VitalFIT!'
      : 'Treino agora é privado.',
    workout,
  });
}

export async function cloneCommunityWorkout(req: Request, res: Response): Promise<void> {
  const workoutId = req.params.id;
  const userId = (req as AuthedRequest).userId;
  const db = await readDatabase();
  const user = db.users.find((u) => u.id === userId);

  const sourceWorkout = db.workouts.find((w) => w.id === workoutId);
  if (!sourceWorkout || !sourceWorkout.publico) {
    res.status(404).json({ error: 'Treino da comunidade não encontrado' });
    return;
  }

  // Increment copy count on source workout
  sourceWorkout.copias = (sourceWorkout.copias ?? 0) + 1;

  // Create personal copy for the user
  const clonedWorkout: Workout = {
    id: crypto.randomUUID(),
    userId,
    titulo: sourceWorkout.titulo,
    descricao: sourceWorkout.descricao,
    grupoMuscular: sourceWorkout.grupoMuscular,
    duracaoMin: sourceWorkout.duracaoMin,
    intensidade: sourceWorkout.intensidade,
    concluido: false,
    publico: false,
    autorNome: user?.nome ?? 'Atleta VitalFIT',
    copias: 0,
    createdAt: new Date().toISOString(),
  };

  db.workouts.push(clonedWorkout);
  await writeDatabase(db);

  res.status(201).json({
    message: `Treino "${sourceWorkout.titulo}" clonado para seus treinos com sucesso!`,
    workout: clonedWorkout,
  });
}

export async function deleteWorkout(req: Request, res: Response): Promise<void> {
  const workoutId = req.params.id;
  const userId = (req as AuthedRequest).userId;
  const db = await readDatabase();

  const index = db.workouts.findIndex((w) => w.id === workoutId && w.userId === userId);
  if (index === -1) {
    res.status(404).json({ error: 'Treino não encontrado' });
    return;
  }

  db.workouts.splice(index, 1);
  await writeDatabase(db);
  res.json({ message: 'Treino excluído com sucesso' });
}

export async function toggleWorkout(req: Request, res: Response): Promise<void> {
  const workoutId = req.params.id;
  const userId = (req as AuthedRequest).userId;
  const db = await readDatabase();

  const workout = db.workouts.find((w) => w.id === workoutId && w.userId === userId);
  if (!workout) {
    res.status(404).json({ error: 'Treino não encontrado' });
    return;
  }

  workout.concluido = !workout.concluido;
  await writeDatabase(db);
  res.json(workout);
}
