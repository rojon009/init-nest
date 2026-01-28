import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import {
  Permissions,
  PermissionCheck,
  PermissionCheckType,
} from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('example')
export class ExampleController {
  // Public endpoint - no authentication required
  @Get('public')
  getPublic() {
    return { message: 'This is a public endpoint' };
  }

  // Protected endpoint - requires authentication only
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected(@CurrentUser() user: User) {
    return {
      message: 'This endpoint requires authentication',
      user: { id: user.id, email: user.email },
    };
  }

  // Requires specific permission
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('users.read')
  @Get('users-read')
  getUsersRead() {
    return {
      message: 'This endpoint requires users.read permission',
    };
  }

  // Requires ALL specified permissions
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('users.read', 'users.update')
  @PermissionCheck(PermissionCheckType.ALL)
  @Get('users-manage')
  getUsersManage() {
    return {
      message:
        'This endpoint requires BOTH users.read AND users.update permissions',
    };
  }

  // Requires ANY of the specified permissions
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('users.delete', 'roles.delete', 'permissions.delete')
  @PermissionCheck(PermissionCheckType.ANY)
  @Get('admin-delete')
  getAdminDelete() {
    return {
      message:
        'This endpoint requires ANY of: users.delete, roles.delete, or permissions.delete',
    };
  }

  // Admin-only endpoint
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('admin.access')
  @Get('admin')
  getAdmin(@CurrentUser() user: User) {
    return {
      message: 'This is an admin-only endpoint',
      user: { id: user.id, email: user.email },
    };
  }
}
