import { SetMetadata } from '@nestjs/common';
import { RolesInterface } from './roles.interface';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolesInterface[]) => SetMetadata(ROLES_KEY, roles);
