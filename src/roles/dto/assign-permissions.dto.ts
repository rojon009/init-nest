import {
    IsArray,
    IsNotEmpty,
    ValidateNested,
    IsUUID,
    IsBoolean,
    IsOptional,
    IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PermissionAssignmentDto {
    @IsUUID('4')
    @IsNotEmpty()
    permissionId: string;

    @IsBoolean()
    @IsOptional()
    granted?: boolean;

    @IsObject()
    @IsOptional()
    conditions?: Record<string, any>;
}

export class AssignPermissionsDto {
    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => PermissionAssignmentDto)
    permissions: PermissionAssignmentDto[];
}
