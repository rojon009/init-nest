import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { Permission } from './entities/permission.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Permission, UserRole, RolePermission])],
    controllers: [PermissionsController],
    providers: [PermissionsService],
    exports: [PermissionsService],
})
export class PermissionsModule { }
