import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

const envSchema = Joi.object({
  MONGODB_URI: Joi.string().uri().required(),
}).unknown(true);

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const { error } = envSchema.validate(process.env);
        if (error) throw new Error(`[MongoDB] ${error.message}`);

        return {
          uri: configService.getOrThrow<string>('MONGODB_URI'),
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class MongodbDatabaseModule {}
