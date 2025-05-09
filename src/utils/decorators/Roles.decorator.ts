
import { Roles as RolesType } from '@/typing';
import { Reflector } from '@nestjs/core';

export const AllowRoles = Reflector.createDecorator<RolesType[]>();
export const DeniedRoles = Reflector.createDecorator<RolesType[]>();
