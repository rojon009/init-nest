import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { nestWinstonLogger } from './logger';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { startOtel } from './otel';

async function bootstrap() {
  startOtel();

  const app = await NestFactory.create(AppModule, {
    logger: nestWinstonLogger,
  });
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(helmet());

  const corsOriginsRaw = configService.get<string>('CORS_ORIGINS') ?? '';
  const corsOrigins = corsOriginsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : false,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.enableShutdownHooks();

  await app.listen(configService.get<number>('PORT') ?? 3000);
}

void bootstrap();
