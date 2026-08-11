import { createApp } from './app.js';
import { ensureDatabase } from './config/database.js';
import { PORT } from './config/env.js';
const app = createApp();
ensureDatabase()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`VitalFIT API rodando em http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error('Falha ao iniciar a API', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map