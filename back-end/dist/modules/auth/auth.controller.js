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
            perfil: user.perfil,
        },
    });
}
//# sourceMappingURL=auth.controller.js.map