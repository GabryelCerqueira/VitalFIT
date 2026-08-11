import type { NextFunction, Request, Response } from 'express';
export type AuthedRequest = Request & {
    userId: string;
};
export declare function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map