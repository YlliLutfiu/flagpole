import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';
import { configureApp } from './configure-app.js';

const DEFAULT_PORT = 3001;

const app = await NestFactory.create(AppModule);
configureApp(app);
await app.listen(process.env.PORT ?? DEFAULT_PORT);
