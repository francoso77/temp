import { SetMetadata } from '@nestjs/common';
import { RoleInterface } from './roles.interface';

export const ROLES_KEY = 'roles';
export const Roles = ({ ...roles }: RoleInterface) => SetMetadata(ROLES_KEY, roles);
