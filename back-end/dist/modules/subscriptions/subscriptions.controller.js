import { defaultPlans, readDatabase, writeDatabase } from '../../config/database.js';
export async function listPlans(_req, res) {
    const db = await readDatabase();
    res.json(db.plans && db.plans.length > 0 ? db.plans : defaultPlans);
}
export async function subscribePlan(req, res) {
    const userId = req.userId;
    const { planId } = req.body;
    if (planId !== 'free' && planId !== 'pro' && planId !== 'elite') {
        res.status(400).json({ error: 'Plano inválido' });
        return;
    }
    const db = await readDatabase();
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
    }
    user.plano = planId;
    await writeDatabase(db);
    const planName = planId === 'elite' ? 'Vital ELITE VIP' : planId === 'pro' ? 'Vital PRO' : 'Vital Free';
    res.json({
        message: `Parabéns! Sua assinatura foi atualizada para ${planName}.`,
        plano: user.plano,
    });
}
//# sourceMappingURL=subscriptions.controller.js.map