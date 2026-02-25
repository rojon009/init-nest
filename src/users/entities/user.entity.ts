import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  Check,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
} from 'typeorm';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

@Entity({ name: 'users' })
@Index('ux_users_email', ['email'], { unique: true })
@Index('idx_users_status', ['status'])
@Check(`"name" <> ''`)
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  // CITEXT = case-insensitive compare + unique works as expected
  @Column({ type: 'citext', unique: true })
  email: string;

  // @Column({ type: 'varchar', length: 255, select: false })
  // passwordHash: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

  @VersionColumn()
  version: number;
}
