import { Roles, UserWithSession } from "@/typing";
import { ALLOWED_BACKOFFICE_ROLES, AllowRoles } from "@/utils";
import { Controller, Get, Param, Put, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RoleService } from "./role.service";

@ApiTags('Role Management')
@ApiBearerAuth()
@Controller("roles")
export class RoleController {
    constructor(private readonly service: RoleService) {}

    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    @Get()
    @ApiOperation({ summary: 'Get all available roles' })
    @ApiResponse({
        status: 200,
        description: 'List of available roles',
        schema: {
            type: 'array',
            items: {
                type: 'string',
                enum: ['admin', 'manager', 'user', 'owner'],
                example: 'admin'
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
    async getRoles() {
        return this.service.getRoles();
    }

    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    @Put("change/:user/:newRole")
    @ApiOperation({ summary: 'Change user role' })
    @ApiParam({
        name: 'user',
        description: 'User register/ID to change role',
        type: 'string',
        example: '123456'
    })
    @ApiParam({
        name: 'newRole',
        description: 'New role to assign',
        enum: ['admin', 'manager', 'user'],
        example: 'manager'
    })
    @ApiResponse({
        status: 200,
        description: 'Role changed successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'User role changed with success!' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Cannot change own role or insufficient permissions' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 500, description: 'Error on update user role' })
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    async changeRole(
        @Param("user") userRegister: string,
        @Param("newRole") newRole: Roles,
        @Request() req: { user: UserWithSession },
    ) {
        return this.service.changeRole(req.user, userRegister, newRole);
    }
}
