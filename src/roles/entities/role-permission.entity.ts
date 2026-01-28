import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('role_permissions')
export class RolePermission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'role_id' })
    roleId: string;

    @Column({ name: 'permission_id' })
    permissionId: string;

    @Column({ default: true })
    granted: boolean;

    @Column({ type: 'jsonb', nullable: true })
    conditions: Record<string, any>;

    @ManyToOne(() => Role, (role) => role.rolePermissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @ManyToOne(() => Permission, (permission) => permission.rolePermissions, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'permission_id' })
    permission: Permission;
}
