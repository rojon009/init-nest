import { SetMetadata } from '@nestjs/common';

export enum PermissionCheckType {
    ANY = 'any',
    ALL = 'all',
}

export const PERMISSIONS_KEY = 'permissions';
export const PERMISSION_CHECK_TYPE_KEY = 'permissionCheckType';

export const Permissions = (
    ...permissions: string[]
) => SetMetadata(PERMISSIONS_KEY, permissions);

export const PermissionCheck = (type: PermissionCheckType) =>
    SetMetadata(PERMISSION_CHECK_TYPE_KEY, type);
