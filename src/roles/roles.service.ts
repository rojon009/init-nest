import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role, RoleStatus } from './entities/role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Permission, PermissionStatus } from '../permissions/entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PermissionAssignmentDto } from './dto/assign-permissions.dto';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(RolePermission)
        private readonly rolePermissionRepository: Repository<RolePermission>,
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ) { }

    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        const existingRole = await this.roleRepository.findOne({
            where: { name: createRoleDto.name },
        });

        if (existingRole) {
            throw new ConflictException('Role with this name already exists');
        }

        const role = this.roleRepository.create(createRoleDto);
        return this.roleRepository.save(role);
    }

    async findAll(
        page: number = 1,
        limit: number = 10,
        search?: string,
    ): Promise<{ data: Role[]; total: number; page: number; limit: number }> {
        const query = this.roleRepository.createQueryBuilder('role');

        if (search) {
            query.where('role.name ILIKE :search OR role.description ILIKE :search', {
                search: `%${search}%`,
            });
        }

        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return { data, total, page, limit };
    }

    async findOne(id: string): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { id } });

        if (!role) {
            throw new NotFoundException('Role not found');
        }

        return role;
    }

    async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { id } });

        if (!role) {
            throw new NotFoundException('Role not found');
        }

        if (updateRoleDto.name && updateRoleDto.name !== role.name) {
            const existingRole = await this.roleRepository.findOne({
                where: { name: updateRoleDto.name },
            });

            if (existingRole) {
                throw new ConflictException('Role with this name already exists');
            }
        }

        Object.assign(role, updateRoleDto);
        return this.roleRepository.save(role);
    }

    async remove(id: string): Promise<void> {
        const role = await this.roleRepository.findOne({ where: { id } });

        if (!role) {
            throw new NotFoundException('Role not found');
        }

        await this.roleRepository.remove(role);
    }

    async assignPermissions(
        roleId: string,
        permissions: PermissionAssignmentDto[],
    ): Promise<void> {
        const role = await this.roleRepository.findOne({ where: { id: roleId } });

        if (!role) {
            throw new NotFoundException('Role not found');
        }

        const permissionIds = permissions.map((p) => p.permissionId);
        const foundPermissions = await this.permissionRepository.find({
            where: { id: In(permissionIds), status: PermissionStatus.ACTIVE },
        });

        if (foundPermissions.length !== permissionIds.length) {
            throw new NotFoundException('One or more permissions not found');
        }

        // Remove existing permissions
        await this.rolePermissionRepository.delete({ roleId });

        // Assign new permissions
        const rolePermissions = permissions.map((p) =>
            this.rolePermissionRepository.create({
                roleId,
                permissionId: p.permissionId,
                granted: p.granted ?? true,
                conditions: p.conditions,
            }),
        );

        await this.rolePermissionRepository.save(rolePermissions);
    }

    async getRolePermissions(roleId: string): Promise<Permission[]> {
        const rolePermissions = await this.rolePermissionRepository.find({
            where: { roleId, granted: true },
            relations: ['permission'],
        });

        return rolePermissions
            .map((rp) => rp.permission)
            .filter((permission) => permission.status === PermissionStatus.ACTIVE);
    }
}
