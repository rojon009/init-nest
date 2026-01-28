import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { PermissionsService } from '../permissions/permissions.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const permissionsService = app.get(PermissionsService);
    const rolesService = app.get(RolesService);
    const usersService = app.get(UsersService);

    console.log('🌱 Seeding database...');

    try {
        // Create permissions
        console.log('Creating permissions...');
        const permissions = await Promise.all([
            // User permissions
            permissionsService.create({
                name: 'users.create',
                displayName: 'Create Users',
                description: 'Ability to create new users',
                type: 'action' as any,
            }),
            permissionsService.create({
                name: 'users.read',
                displayName: 'Read Users',
                description: 'Ability to view users',
                type: 'action' as any,
            }),
            permissionsService.create({
                name: 'users.update',
                displayName: 'Update Users',
                description: 'Ability to update users',
                type: 'action' as any,
            }),
            permissionsService.create({
                name: 'users.delete',
                displayName: 'Delete Users',
                description: 'Ability to delete users',
                type: 'action' as any,
            }),
            permissionsService.create({
                name: 'users.assign-roles',
                displayName: 'Assign Roles to Users',
                description: 'Ability to assign roles to users',
                type: 'action' as any,
            }),

            // Role permissions
            permissionsService.create({
                name: 'roles.create',
                displayName: 'Create Roles',
                description: 'Ability to create new roles',
                type: 'action' as any,
            }),
            permissionsService.create({
                name: 'roles.read',
                displayName: 'Read Roles',
                description: 'Ability to view roles',
                type: 'action' as any,
            }),
            permissionsService.create({
                name: 'roles.update',
                displayName: 'Update Roles',
                description: 'Ability to update roles',
                type: 'action' as any,
            }),
            permissionsService.create({
                name: 'roles.delete',
                displayName: 'Delete Roles',
                description: 'Ability to delete roles',
                type: 'action' as any,
            }),
            permissionsService.create({
                name: 'roles.assign-permissions',
                displayName: 'Assign Permissions to Roles',
                description: 'Ability to assign permissions to roles',
                type: 'action' as any,
            }),

            // Permission permissions
            permissionsService.create({
                name: 'permissions.create',
                displayName: 'Create Permissions',
                description: 'Ability to create new permissions',
                type: 'action' as any,
            }),
            permissionsService.create({
                name: 'permissions.read',
                displayName: 'Read Permissions',
                description: 'Ability to view permissions',
                type: 'action' as any,
            }),
            permissionsService.create({
                name: 'permissions.update',
                displayName: 'Update Permissions',
                description: 'Ability to update permissions',
                type: 'action' as any,
            }),
            permissionsService.create({
                name: 'permissions.delete',
                displayName: 'Delete Permissions',
                description: 'Ability to delete permissions',
                type: 'action' as any,
            }),

            // Admin permission
            permissionsService.create({
                name: 'admin.access',
                displayName: 'Admin Access',
                description: 'Full administrative access',
                type: 'action' as any,
            }),
        ]);

        console.log(`✅ Created ${permissions.length} permissions`);

        // Create admin role
        console.log('Creating admin role...');
        const adminRole = await rolesService.create({
            name: 'admin',
            description: 'Administrator with full access',
            priority: 100,
        });

        console.log('✅ Created admin role');

        // Assign all permissions to admin role
        console.log('Assigning permissions to admin role...');
        await rolesService.assignPermissions(
            adminRole.id,
            permissions.map((p) => ({ permissionId: p.id, granted: true })),
        );

        console.log('✅ Assigned all permissions to admin role');

        // Create user role
        console.log('Creating user role...');
        const userRole = await rolesService.create({
            name: 'user',
            description: 'Regular user with limited access',
            priority: 10,
        });

        console.log('✅ Created user role');

        // Assign basic permissions to user role
        const userPermissions = permissions.filter((p) =>
            ['users.read', 'roles.read', 'permissions.read'].includes(p.name),
        );

        await rolesService.assignPermissions(
            userRole.id,
            userPermissions.map((p) => ({ permissionId: p.id, granted: true })),
        );

        console.log('✅ Assigned basic permissions to user role');

        // Create admin user
        console.log('Creating admin user...');
        const adminUser = await usersService.create({
            email: 'admin@example.com',
            password: 'admin123',
        });

        console.log('✅ Created admin user (email: admin@example.com, password: admin123)');

        // Assign admin role to admin user
        console.log('Assigning admin role to admin user...');
        await usersService.assignRoles(adminUser.id, [adminRole.id]);

        console.log('✅ Assigned admin role to admin user');

        // Create regular user
        console.log('Creating regular user...');
        const regularUser = await usersService.create({
            email: 'user@example.com',
            password: 'user123',
        });

        console.log('✅ Created regular user (email: user@example.com, password: user123)');

        // Assign user role to regular user
        console.log('Assigning user role to regular user...');
        await usersService.assignRoles(regularUser.id, [userRole.id]);

        console.log('✅ Assigned user role to regular user');

        console.log('\n🎉 Seeding completed successfully!');
        console.log('\n📝 Test Credentials:');
        console.log('   Admin: admin@example.com / admin123');
        console.log('   User:  user@example.com / user123');
        console.log('\n🚀 You can now login at POST /auth/login');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }

    await app.close();
}

bootstrap();
