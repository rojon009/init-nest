import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { UserRole } from '../../users/entities/user-role.entity';
import { RolePermission } from './role-permission.entity';

export enum RoleStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: RoleStatus,
        default: RoleStatus.ACTIVE,
    })
    status: RoleStatus;

    @Column({ type: 'int', default: 0 })
    priority: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => UserRole, (userRole) => userRole.role)
    userRoles: UserRole[];

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
    rolePermissions: RolePermission[];
}
