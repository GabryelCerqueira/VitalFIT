import type { Alimento, Database, Dieta24h, SubscriptionPlan } from '../types/domain.js';
export declare const defaultPlans: SubscriptionPlan[];
export declare const defaultAlimentos: Alimento[];
export declare const defaultDietas: Dieta24h[];
export declare function ensureDatabase(): Promise<void>;
export declare function readDatabase(): Promise<Database>;
export declare function writeDatabase(db: Database): Promise<void>;
//# sourceMappingURL=database.d.ts.map