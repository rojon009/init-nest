import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    ParseUUIDPipe,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    @Permissions('roles.create')
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(createRoleDto);
    }

    @Get()
    @Permissions('roles.read')
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        return this.rolesService.findAll(
            page ? parseInt(page, 10) : 1,
            limit ? parseInt(limit, 10) : 10,
            search,
        );
    }

    @Get(':id')
    @Permissions('roles.read')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.rolesService.findOne(id);
    }

    @Patch(':id')
    @Permissions('roles.update')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateRoleDto: UpdateRoleDto,
    ) {
        return this.rolesService.update(id, updateRoleDto);
    }

    @Delete(':id')
    @Permissions('roles.delete')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.rolesService.remove(id);
    }

    @Post(':id/permissions')
    @Permissions('roles.assign-permissions')
    assignPermissions(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() assignPermissionsDto: AssignPermissionsDto,
    ) {
        return this.rolesService.assignPermissions(
            id,
            assignPermissionsDto.permissions,
        );
    }

    @Get(':id/permissions')
    @Permissions('roles.read')
    getRolePermissions(@Param('id', ParseUUIDPipe) id: string) {
        return this.rolesService.getRolePermissions(id);
    }
}
