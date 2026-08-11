import type { Database } from '../types/domain.js';
export declare function ensureDatabase(): Promise<void>;
export declare function readDatabase(): Promise<Database>;
export declare function writeDatabase(db: Database): Promise<void>;
//# sourceMappingURL=database.d.ts.map