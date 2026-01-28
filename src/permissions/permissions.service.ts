import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission, PermissionStatus } from './entities/permission.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';
import { RoleStatus } from '../roles/entities/role.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const existingPermission = await this.permissionRepository.findOne({
      where: { name: createPermissionDto.name },
    });

    if (existingPermission) {
      throw new ConflictException('Permission with this name already exists');
    }

    const permission = this.permissionRepository.create(createPermissionDto);
    return this.permissionRepository.save(permission);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{
    data: Permission[];
    total: number;
    page: number;
    limit: number;
  }> {
    const query = this.permissionRepository.createQueryBuilder('permission');

    if (search) {
      query.where(
        'permission.name ILIKE :search OR permission.displayName ILIKE :search OR permission.description ILIKE :search',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    if (
      updatePermissionDto.name &&
      updatePermissionDto.name !== permission.name
    ) {
      const existingPermission = await this.permissionRepository.findOne({
        where: { name: updatePermissionDto.name },
      });

      if (existingPermission) {
        throw new ConflictException('Permission with this name already exists');
      }
    }

    Object.assign(permission, updatePermissionDto);
    return this.permissionRepository.save(permission);
  }

  async remove(id: string): Promise<void> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    await this.permissionRepository.remove(permission);
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    // Get all active roles for the user
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
      relations: ['role'],
    });

    const activeRoleIds = userRoles
      .filter((ur) => ur.role.status === RoleStatus.ACTIVE)
      .map((ur) => ur.roleId);

    if (activeRoleIds.length === 0) {
      return [];
    }

    // Get all granted permissions for these roles
    const rolePermissions = await this.rolePermissionRepository
      .createQueryBuilder('rp')
      .leftJoinAndSelect('rp.permission', 'permission')
      .where('rp.roleId IN (:...roleIds)', { roleIds: activeRoleIds })
      .andWhere('rp.granted = :granted', { granted: true })
      .andWhere('permission.status = :status', {
        status: PermissionStatus.ACTIVE,
      })
      .getMany();

    // Remove duplicates
    const uniquePermissions = new Map<string, Permission>();
    rolePermissions.forEach((rp) => {
      if (rp.permission && !uniquePermissions.has(rp.permission.id)) {
        uniquePermissions.set(rp.permission.id, rp.permission);
      }
    });

    return Array.from(uniquePermissions.values());
  }
}
