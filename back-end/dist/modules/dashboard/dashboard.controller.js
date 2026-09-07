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
function getGreeting(name) {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12)
        return `Bom dia, ${name}!`;
    if (hour >= 12 && hour < 18)
        return `Boa tarde, ${name}!`;
    return `Boa noite, ${name}!`;
}
function calculateImc(peso, altura) {
    if (!altura || altura <= 0)
        return { valor: 0, classificacao: 'Não informado' };
    const imc = Number((peso / (altura * altura)).toFixed(1));
    let classificacao = 'Normal';
    if (imc < 18.5)
        classificacao = 'Abaixo do peso';
    else if (imc < 25)
        classificacao = 'Peso ideal';
    else if (imc < 30)
        classificacao = 'Sobrepeso';
    else if (imc < 35)
        classificacao = 'Obesidade Grau I';
    else
        classificacao = 'Obesidade Grau II';
    return { valor: imc, classificacao };
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
    const imc = calculateImc(user.perfil.peso, user.perfil.altura);
    const treinosConcluidos = workouts.filter((item) => item.concluido).length;
    const totalMinutos = workouts.reduce((acc, w) => acc + w.duracaoMin, 0);
    res.json({
        saudacao: getGreeting(user.nome),
        metricas: {
            peso: user.perfil.peso,
            altura: user.perfil.altura,
            idade: user.perfil.idade,
            treinosCriados: workouts.length,
            treinosConcluidos,
            totalMinutos,
            extensoesAtivas: installedExtensions,
            imc,
        },
        progressoDiario: progress,
    });
}
//# sourceMappingURL=dashboard.controller.js.map