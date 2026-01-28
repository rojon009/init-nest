import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PERMISSIONS_KEY,
  PERMISSION_CHECK_TYPE_KEY,
  PermissionCheckType,
} from '../decorators/permissions.decorator';
import { PermissionsService } from '../../permissions/permissions.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const checkType =
      this.reflector.getAllAndOverride<PermissionCheckType>(
        PERMISSION_CHECK_TYPE_KEY,
        [context.getHandler(), context.getClass()],
      ) || PermissionCheckType.ALL;

    const request = context.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const userPermissions = await this.permissionsService.getUserPermissions(
      user.id,
    );

    const userPermissionNames = userPermissions.map((p) => p.name);

    let hasPermission = false;

    if (checkType === PermissionCheckType.ANY) {
      hasPermission = requiredPermissions.some((permission) =>
        userPermissionNames.includes(permission),
      );
    } else {
      hasPermission = requiredPermissions.every((permission) =>
        userPermissionNames.includes(permission),
      );
    }

    if (!hasPermission) {
      throw new ForbiddenException(
        `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
