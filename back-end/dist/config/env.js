import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const PORT = Number(process.env.PORT ?? 3333);
export const DB_PATH = path.join(__dirname, '..', 'data', 'database.json');
//# sourceMappingURL=env.js.map