import type { Request, Response } from 'express';
import { readDatabase } from '../../config/database.js';
import type { AuthedRequest } from '../../middlewares/auth.middleware.js';
import type { User, Workout } from '../../types/domain.js';

function calculateDailyGoal(user: User): number {
  const base = user.perfil.peso * 25;
  const ageFactor = user.perfil.idade > 40 ? 0.9 : 1;
  return Math.round(base * ageFactor);
}

function createProgress(workouts: Workout[], user: User): { progresso: number; objetivo: number; percentual: number } {
  const objetivo = calculateDailyGoal(user);
  const calorias = workouts.reduce((acc, workout) => acc + workout.duracaoMin * 6, 0);
  const percentual = Math.min(100, Math.round((calorias / objetivo) * 100));
  return { progresso: calorias, objetivo, percentual };
}

export async function getDashboard(req: Request, res: Response): Promise<void> {
  const userId = (req as AuthedRequest).userId;
  const db = await readDatabase();
  const user = db.users.find((item) => item.id === userId);

  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return;
  }

  const workouts = db.workouts.filter((item) => item.userId === user.id);
  const progress = createProgress(workouts, user);
  const installedExtensions = db.userExtensions.filter((item) => item.userId === user.id).length;

  res.json({
    saudacao: `Bom dia, ${user.nome}`,
    metricas: {
      peso: user.perfil.peso,
      altura: user.perfil.altura,
      idade: user.perfil.idade,
      treinosCriados: workouts.length,
      extensoesAtivas: installedExtensions,
    },
    progressoDiario: progress,
  });
}
