import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [PermissionsModule],
  controllers: [ExampleController],
})
export class ExampleModule {}
