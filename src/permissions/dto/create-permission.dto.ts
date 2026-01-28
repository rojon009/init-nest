import {
    IsNotEmpty,
    IsString,
    IsEnum,
    IsOptional,
} from 'class-validator';
import { PermissionType, PermissionStatus } from '../entities/permission.entity';

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    displayName: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(PermissionType)
    @IsOptional()
    type?: PermissionType;

    @IsEnum(PermissionStatus)
    @IsOptional()
    status?: PermissionStatus;
}
