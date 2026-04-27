import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
// Swap import to MongodbDatabaseModule to use MongoDB instead
import { PostgresDatabaseModule } from './database/postgres.database.module';
// import { MongodbDatabaseModule } from './database/mongodb.database.module';
import { OtelShutdownService } from './otel-shutdown.service';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().port().default(3000),
        LOG_LEVEL: Joi.string()
          .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
          .default('info'),

        CORS_ORIGINS: Joi.string().default(''),
      }),
      validationOptions: {
        abortEarly: true,
        allowUnknown: true,
      },
    }),
    ThrottlerModule.forRoot([{ name: 'short', ttl: 60_000, limit: 20 }]),
    PostgresDatabaseModule, // swap to MongodbDatabaseModule for MongoDB
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    OtelShutdownService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
