import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from './permissions.guard';
import { PermissionsService } from '../../permissions/permissions.service';
import {
  PERMISSIONS_KEY,
  PERMISSION_CHECK_TYPE_KEY,
  PermissionCheckType,
} from '../decorators/permissions.decorator';
import {
  Permission,
  PermissionStatus,
} from '../../permissions/entities/permission.entity';

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;
  let permissionsService: PermissionsService;

  const mockPermissionsService = {
    getUserPermissions: jest.fn(),
  };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: PermissionsService,
          useValue: mockPermissionsService,
        },
      ],
    }).compile();

    guard = module.get<PermissionsGuard>(PermissionsGuard);
    reflector = module.get<Reflector>(Reflector);
    permissionsService = module.get<PermissionsService>(PermissionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockExecutionContext = (user: any): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  };

  const createMockPermission = (name: string): Permission => ({
    id: `${name}-id`,
    name,
    displayName: name,
    description: '',
    type: 'action' as any,
    status: PermissionStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    rolePermissions: [],
  });

  describe('canActivate', () => {
    it('should allow access when no permissions are required', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(null);
      const context = createMockExecutionContext({ id: 'user-id' });

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access when user has required permission (ALL check)', async () => {
      const user = { id: 'user-id' };
      const requiredPermissions = ['users.read'];
      const userPermissions = [createMockPermission('users.read')];

      mockReflector.getAllAndOverride
        .mockReturnValueOnce(requiredPermissions)
        .mockReturnValueOnce(PermissionCheckType.ALL);
      mockPermissionsService.getUserPermissions.mockResolvedValue(
        userPermissions,
      );

      const context = createMockExecutionContext(user);
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockPermissionsService.getUserPermissions).toHaveBeenCalledWith(
        user.id,
      );
    });

    it('should allow access when user has ALL required permissions', async () => {
      const user = { id: 'user-id' };
      const requiredPermissions = ['users.read', 'users.update'];
      const userPermissions = [
        createMockPermission('users.read'),
        createMockPermission('users.update'),
        createMockPermission('users.delete'),
      ];

      mockReflector.getAllAndOverride
        .mockReturnValueOnce(requiredPermissions)
        .mockReturnValueOnce(PermissionCheckType.ALL);
      mockPermissionsService.getUserPermissions.mockResolvedValue(
        userPermissions,
      );

      const context = createMockExecutionContext(user);
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny access when user lacks one of the required permissions (ALL check)', async () => {
      const user = { id: 'user-id' };
      const requiredPermissions = ['users.read', 'users.update'];
      const userPermissions = [createMockPermission('users.read')];

      mockReflector.getAllAndOverride
        .mockReturnValueOnce(requiredPermissions)
        .mockReturnValueOnce(PermissionCheckType.ALL);
      mockPermissionsService.getUserPermissions.mockResolvedValue(
        userPermissions,
      );

      const context = createMockExecutionContext(user);

      await expect(guard.canActivate(context)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should allow access when user has ANY of the required permissions', async () => {
      const user = { id: 'user-id' };
      const requiredPermissions = [
        'users.delete',
        'roles.delete',
        'permissions.delete',
      ];
      const userPermissions = [createMockPermission('roles.delete')];

      mockReflector.getAllAndOverride
        .mockReturnValueOnce(requiredPermissions)
        .mockReturnValueOnce(PermissionCheckType.ANY);
      mockPermissionsService.getUserPermissions.mockResolvedValue(
        userPermissions,
      );

      const context = createMockExecutionContext(user);
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny access when user has NONE of the required permissions (ANY check)', async () => {
      const user = { id: 'user-id' };
      const requiredPermissions = ['users.delete', 'roles.delete'];
      const userPermissions = [createMockPermission('users.read')];

      mockReflector.getAllAndOverride
        .mockReturnValueOnce(requiredPermissions)
        .mockReturnValueOnce(PermissionCheckType.ANY);
      mockPermissionsService.getUserPermissions.mockResolvedValue(
        userPermissions,
      );

      const context = createMockExecutionContext(user);

      await expect(guard.canActivate(context)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException when user is not authenticated', async () => {
      mockReflector.getAllAndOverride
        .mockReturnValueOnce(['users.read'])
        .mockReturnValueOnce(PermissionCheckType.ALL);

      const context = createMockExecutionContext(null);

      await expect(guard.canActivate(context)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should default to ALL check type when not specified', async () => {
      const user = { id: 'user-id' };
      const requiredPermissions = ['users.read', 'users.update'];
      const userPermissions = [
        createMockPermission('users.read'),
        createMockPermission('users.update'),
      ];

      mockReflector.getAllAndOverride
        .mockReturnValueOnce(requiredPermissions)
        .mockReturnValueOnce(null); // No check type specified
      mockPermissionsService.getUserPermissions.mockResolvedValue(
        userPermissions,
      );

      const context = createMockExecutionContext(user);
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });
  });
});
