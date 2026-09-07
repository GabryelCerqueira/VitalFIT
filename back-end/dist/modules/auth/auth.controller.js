import crypto from 'node:crypto';
import { readDatabase, writeDatabase } from '../../config/database.js';
import { loginSchema, registerSchema } from '../../schemas/userSchemas.js';
import { createPasswordHash, verifyPassword } from '../../utils/password.js';
export async function register(req, res) {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Dados inválidos' });
        return;
    }
    const payload = parsed.data;
    const db = await readDatabase();
    const email = payload.email.toLowerCase();
    const exists = db.users.some((user) => user.email === email);
    if (exists) {
        res.status(409).json({ error: 'Este e-mail já está cadastrado' });
        return;
    }
    const user = {
        id: crypto.randomUUID(),
        nome: payload.nome,
        email,
        senhaHash: createPasswordHash(payload.senha),
        role: 'user',
        plano: 'free',
        perfil: payload.perfil,
        createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    await writeDatabase(db);
    res.status(201).json({ message: 'Cadastro realizado com sucesso' });
}
export async function login(req, res) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Dados inválidos' });
        return;
    }
    const payload = parsed.data;
    const db = await readDatabase();
    const email = payload.email.toLowerCase();
    const user = db.users.find((item) => item.email === email);
    if (!user || !verifyPassword(payload.senha, user.senhaHash)) {
        res.status(401).json({ error: 'E-mail ou senha inválidos' });
        return;
    }
    const token = crypto.randomUUID();
    db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
    await writeDatabase(db);
    res.json({
        token,
        user: {
            id: user.id,
            nome: user.nome,
            email: user.email,
            role: user.role ?? 'user',
            plano: user.plano ?? 'free',
            perfil: user.perfil,
        },
    });
}
export async function me(req, res) {
    const userId = req.userId;
    const db = await readDatabase();
    const user = db.users.find((item) => item.id === userId);
    if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
    }
    res.json({
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role ?? 'user',
        plano: user.plano ?? 'free',
        perfil: user.perfil,
    });
}
export async function changePassword(req, res) {
    const userId = req.userId;
    const { senhaAtual, novaSenha } = req.body;
    if (!senhaAtual || !novaSenha) {
        res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
        return;
    }
    if (typeof novaSenha !== 'string' || novaSenha.length < 6) {
        res.status(400).json({ error: 'A nova senha deve ter no mínimo 6 caracteres' });
        return;
    }
    const db = await readDatabase();
    const user = db.users.find((item) => item.id === userId);
    if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
    }
    if (!verifyPassword(senhaAtual, user.senhaHash)) {
        res.status(400).json({ error: 'A senha atual está incorreta' });
        return;
    }
    user.senhaHash = createPasswordHash(novaSenha);
    await writeDatabase(db);
    res.json({ message: 'Senha alterada com sucesso!' });
}
//# sourceMappingURL=auth.controller.js.map