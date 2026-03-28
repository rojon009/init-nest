import 'reflect-metadata';

import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/entities/user.entity';

// Load .env for CLI use (Nest runtime loads config in AppModule).
void ConfigModule.forRoot({ isGlobal: false });

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
