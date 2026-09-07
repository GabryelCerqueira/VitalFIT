import type { Request, Response } from 'express';
import { readDatabase, writeDatabase } from '../../config/database.js';

export async function getAdminMetrics(_req: Request, res: Response): Promise<void> {
  const db = await readDatabase();

  const totalUsers = db.users.length;
  const totalWorkouts = db.workouts.length;
  const totalPosts = (db.posts ?? []).length;
  const totalInstalledExtensions = db.userExtensions.length;

  const plansCount = {
    free: db.users.filter((u) => !u.plano || u.plano === 'free').length,
    pro: db.users.filter((u) => u.plano === 'pro').length,
    elite: db.users.filter((u) => u.plano === 'elite').length,
  };

  const estimatedMonthlyRevenue = Number(
    (plansCount.pro * 29.9 + plansCount.elite * 59.9).toFixed(2),
  );

  res.json({
    totalUsers,
    totalWorkouts,
    totalPosts,
    totalInstalledExtensions,
    plansCount,
    estimatedMonthlyRevenue,
  });
}

export async function getAdminUsers(_req: Request, res: Response): Promise<void> {
  const db = await readDatabase();

  const users = db.users.map((u) => {
    const workoutsCount = db.workouts.filter((w) => w.userId === u.id).length;
    return {
      id: u.id,
      nome: u.nome,
      email: u.email,
      role: u.role ?? 'user',
      plano: u.plano ?? 'free',
      perfil: u.perfil,
      workoutsCount,
      createdAt: u.createdAt,
    };
  });

  res.json(users);
}

export async function updateUserRole(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { role } = req.body as { role: 'admin' | 'user' };

  if (role !== 'admin' && role !== 'user') {
    res.status(400).json({ error: 'Papel inválido. Deve ser admin ou user' });
    return;
  }

  const db = await readDatabase();
  const user = db.users.find((u) => u.id === id);

  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return;
  }

  user.role = role;
  await writeDatabase(db);

  res.json({ message: `Papel do usuário ${user.nome} atualizado para ${role}`, user });
}

export async function updateUserPlan(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { plano } = req.body as { plano: 'free' | 'pro' | 'elite' };

  if (plano !== 'free' && plano !== 'pro' && plano !== 'elite') {
    res.status(400).json({ error: 'Plano inválido' });
    return;
  }

  const db = await readDatabase();
  const user = db.users.find((u) => u.id === id);

  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return;
  }

  user.plano = plano;
  await writeDatabase(db);

  res.json({ message: `Plano do usuário ${user.nome} alterado para ${plano.toUpperCase()}`, user });
}
