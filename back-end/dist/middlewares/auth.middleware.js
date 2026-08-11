import { readDatabase } from '../config/database.js';
export async function requireAuth(req, _res, next) {
    const auth = req.header('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
        next(new Error('AUTH_MISSING'));
        return;
    }
    const token = auth.slice('Bearer '.length).trim();
    const db = await readDatabase();
    const session = db.sessions.find((item) => item.token === token);
    if (!session) {
        next(new Error('AUTH_INVALID'));
        return;
    }
    req.userId = session.userId;
    next();
}
//# sourceMappingURL=auth.middleware.js.map