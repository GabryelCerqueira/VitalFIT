import { readDatabase } from '../../config/database.js';
function calculateDailyGoal(user) {
    const base = user.perfil.peso * 25;
    const ageFactor = user.perfil.idade > 40 ? 0.9 : 1;
    return Math.round(base * ageFactor);
}
function createProgress(workouts, user) {
    const objetivo = calculateDailyGoal(user);
    const calorias = workouts.reduce((acc, workout) => acc + workout.duracaoMin * 6, 0);
    const percentual = Math.min(100, Math.round((calorias / objetivo) * 100));
    return { progresso: calorias, objetivo, percentual };
}
export async function getDashboard(req, res) {
    const userId = req.userId;
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
//# sourceMappingURL=dashboard.controller.js.map