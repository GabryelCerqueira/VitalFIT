import crypto from 'node:crypto';
import { readDatabase, writeDatabase } from '../../config/database.js';
import { createWorkoutSchema } from '../../schemas/userSchemas.js';
export async function listWorkouts(req, res) {
    const userId = req.userId;
    const db = await readDatabase();
    const workouts = db.workouts.filter((item) => item.userId === userId);
    res.json(workouts);
}
export async function createWorkout(req, res) {
    const parsed = createWorkoutSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Dados inválidos' });
        return;
    }
    const userId = req.userId;
    const db = await readDatabase();
    const workout = {
        id: crypto.randomUUID(),
        userId,
        ...parsed.data,
        createdAt: new Date().toISOString(),
    };
    db.workouts.push(workout);
    await writeDatabase(db);
    res.status(201).json(workout);
}
//# sourceMappingURL=workouts.controller.js.map