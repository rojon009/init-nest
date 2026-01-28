## Role & Permission Based Auth

This project uses **JWT auth** plus **permission strings** to protect routes.

- **JWT** authenticates the user and attaches `user` to the request (`JwtAuthGuard`).
- **Permissions** on routes are declared via decorators.
- **`PermissionsGuard`** reads those decorators and checks the user’s effective permissions.

### Core Pieces

- **Guards**
  - `JwtAuthGuard`: wraps Passport `jwt` strategy; ensures the request has a valid token.
  - `PermissionsGuard`: checks required permission strings against the user’s permissions.
- **Decorators**
  - `@Permissions(...permissions: string[])`: attach required permission names to a handler/class.
  - `@PermissionCheck(type: PermissionCheckType)`: choose `ALL` (default) or `ANY` check.
- **Domain**
  - `Permission` entity with `name` (e.g. `users.read`) and `status`.
  - `Role` entity aggregates permissions; users are assigned roles.

### How Route Protection Works

1. Controllers opt‑in to auth:
   - `@UseGuards(JwtAuthGuard, PermissionsGuard)` at controller or handler level.
2. Handlers declare required permissions:
   - `@Permissions('users.read')`
   - Optionally: `@PermissionCheck(PermissionCheckType.ANY)` to allow **any** of the listed permissions instead of all.
3. Request flow:
   - `JwtAuthGuard` validates the JWT and sets `request.user`.
   - `PermissionsGuard`:
     - Reads required permissions via `Reflector` from `@Permissions`.
     - Resolves `PermissionCheckType` (default `ALL`).
     - Loads `userPermissions` using `PermissionsService.getUserPermissions(user.id)`.
     - Checks that `userPermissions` satisfy the required permissions;
       otherwise throws `ForbiddenException`.

Example (`users` controller):

```ts
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  @Get()
  @Permissions('users.read')
  findAll(/* ... */) { /* ... */ }

  @Post(':id/roles')
  @Permissions('users.assign-roles')
  assignRoles(/* ... */) { /* ... */ }
}
```

### Managing Roles & Permissions

- **Seeding initial data**: `npm run seed`
  - Creates base permissions (users/roles/permissions CRUD, admin access).
  - Creates roles: `admin` (full access) and `user` (read‑only).
  - Creates `admin@example.com` / `admin123` and `user@example.com` / `user123`.
- **Assign permissions to roles**
  - `POST /roles/:id/permissions` with a list of permission IDs.
- **Assign roles to users**
  - `POST /users/:id/roles` with a list of role IDs.

### Adding a New Protected Endpoint

1. Define the permission in the DB (e.g. via seed or permissions API), e.g. `reports.read`.
2. Assign that permission to one or more roles.
3. Protect the route:

```ts
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('reports.read')
@Get('reports')
getReports() { /* ... */ }
```

