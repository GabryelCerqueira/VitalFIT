import fs from 'node:fs/promises';
import path from 'node:path';
import { DB_PATH } from './env.js';
const defaultDb = {
    users: [],
    sessions: [],
    workouts: [],
    extensions: [
        {
            id: 'water-tracker-pro',
            nome: 'Water Tracker Pro',
            descricao: 'Monitora hidratação diária e envia lembretes inteligentes.',
            categoria: 'Saúde',
        },
        {
            id: 'sleep-monitor-plus',
            nome: 'Sleep Monitor Plus',
            descricao: 'Avalia qualidade do sono e gera recomendações semanais.',
            categoria: 'Hábitos',
        },
        {
            id: 'macro-balancer',
            nome: 'Macro Balancer',
            descricao: 'Calcula e acompanha macros com base nos seus objetivos.',
            categoria: 'Nutrição',
        },
    ],
    userExtensions: [],
};
export async function ensureDatabase() {
    const dirPath = path.dirname(DB_PATH);
    await fs.mkdir(dirPath, { recursive: true });
    try {
        await fs.access(DB_PATH);
    }
    catch {
        await fs.writeFile(DB_PATH, JSON.stringify(defaultDb, null, 2), 'utf8');
    }
}
export async function readDatabase() {
    const content = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(content);
}
export async function writeDatabase(db) {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}
//# sourceMappingURL=database.js.map