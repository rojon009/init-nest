import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { RoleStatus } from '../entities/role.entity';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(RoleStatus)
  @IsOptional()
  status?: RoleStatus;

  @IsInt()
  @Min(0)
  @IsOptional()
  priority?: number;
}
