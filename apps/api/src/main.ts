import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';
import { configureApp } from './configure-app.js';

const DEFAULT_PORT = 3001;

const app = await NestFactory.create(AppModule);
// Run shutdown hooks (e.g. closing the database pool) on SIGINT/SIGTERM, not only on app.close().
app.enableShutdownHooks();
configureApp(app);
await app.listen(process.env.PORT ?? DEFAULT_PORT);
