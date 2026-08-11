import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares/error.middleware.js';
import { router } from './routes/index.js';
export function createApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(router);
    app.use(errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map