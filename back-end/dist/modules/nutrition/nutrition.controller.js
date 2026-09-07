import crypto from 'node:crypto';
import { readDatabase, writeDatabase } from '../../config/database.js';
export async function listFoods(_req, res) {
    const db = await readDatabase();
    res.json({ alimentos: db.alimentos || [] });
}
export async function listDiets(_req, res) {
    const db = await readDatabase();
    res.json({ dietas: db.dietas || [] });
}
export async function createDiet(req, res) {
    const userId = req.userId;
    const db = await readDatabase();
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
    }
    const { titulo, descricao, objetivo, caloriasTotais, proteinasTotais, carboidratosTotais, gordurasTotais, refeicoes, publica = true, } = req.body;
    if (!titulo || !objetivo || !Array.isArray(refeicoes) || refeicoes.length === 0) {
        res.status(400).json({
            error: 'Título, objetivo e ao menos uma refeição são obrigatórios.',
        });
        return;
    }
    const novaDieta = {
        id: crypto.randomUUID(),
        userId: user.id,
        autorNome: user.nome,
        titulo: String(titulo).trim(),
        descricao: descricao ? String(descricao).trim() : undefined,
        objetivo,
        caloriasTotais: Number(caloriasTotais) || 0,
        proteinasTotais: Number(proteinasTotais) || 0,
        carboidratosTotais: Number(carboidratosTotais) || 0,
        gordurasTotais: Number(gordurasTotais) || 0,
        refeicoes: refeicoes.map((r) => ({
            nome: String(r.nome || 'Refeição').trim(),
            horario: String(r.horario || '12:00').trim(),
            itens: String(r.itens || '').trim(),
            caloriasAprox: Number(r.caloriasAprox) || 0,
        })),
        publica: Boolean(publica),
        copias: 0,
        createdAt: new Date().toISOString(),
    };
    db.dietas = [novaDieta, ...(db.dietas || [])];
    await writeDatabase(db);
    res.status(201).json({
        message: 'Dieta criada com sucesso!',
        dieta: novaDieta,
    });
}
export async function cloneDiet(req, res) {
    const userId = req.userId;
    const db = await readDatabase();
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
    }
    const { id } = req.params;
    const original = (db.dietas || []).find((d) => d.id === id);
    if (!original) {
        res.status(404).json({ error: 'Dieta não encontrada.' });
        return;
    }
    original.copias = (original.copias || 0) + 1;
    const clonada = {
        id: crypto.randomUUID(),
        userId: user.id,
        autorNome: `${user.nome} (cópia de ${original.autorNome})`,
        titulo: `${original.titulo} (Minha Cópia)`,
        descricao: original.descricao,
        objetivo: original.objetivo,
        caloriasTotais: original.caloriasTotais,
        proteinasTotais: original.proteinasTotais,
        carboidratosTotais: original.carboidratosTotais,
        gordurasTotais: original.gordurasTotais,
        refeicoes: original.refeicoes.map((r) => ({
            ...r,
        })),
        publica: false,
        copias: 0,
        createdAt: new Date().toISOString(),
    };
    db.dietas = [clonada, ...(db.dietas || [])];
    await writeDatabase(db);
    res.status(201).json({
        message: 'Dieta 24h adotada e copiada para suas dietas com sucesso!',
        dieta: clonada,
    });
}
export async function deleteDiet(req, res) {
    const userId = req.userId;
    const db = await readDatabase();
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
    }
    const { id } = req.params;
    const index = (db.dietas || []).findIndex((d) => d.id === id);
    if (index === -1) {
        res.status(404).json({ error: 'Dieta não encontrada.' });
        return;
    }
    const dieta = (db.dietas || [])[index];
    if (!dieta) {
        res.status(404).json({ error: 'Dieta não encontrada.' });
        return;
    }
    if (dieta.userId !== user.id && user.role !== 'admin') {
        res.status(403).json({ error: 'Você não tem permissão para excluir esta dieta.' });
        return;
    }
    db.dietas.splice(index, 1);
    await writeDatabase(db);
    res.json({ message: 'Dieta removida com sucesso.' });
}
//# sourceMappingURL=nutrition.controller.js.map