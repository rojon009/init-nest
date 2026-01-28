import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { RolePermission } from '../../roles/entities/role-permission.entity';

export enum PermissionType {
    MODULE = 'module',
    ROUTE = 'route',
    ACTION = 'action',
    RESOURCE = 'resource',
}

export enum PermissionStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ name: 'display_name' })
    displayName: string;

    @Column({ nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: PermissionType,
        default: PermissionType.ACTION,
    })
    type: PermissionType;

    @Column({
        type: 'enum',
        enum: PermissionStatus,
        default: PermissionStatus.ACTIVE,
    })
    status: PermissionStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
    rolePermissions: RolePermission[];
}
