import { UserService } from "@/modules/shared/user";
import { ALLOWED_BACKOFFICE_ROLES } from "@/utils";
import { AllowRoles } from "@/utils/decorators";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('User Management')
@Controller("users")
export class UserController {
    constructor(private readonly service: UserService) {}

    @ApiOperation({ summary: 'Get user by register' })
    @ApiBearerAuth()
    @ApiParam({
        name: 'register',
        description: 'User register/ID',
        type: 'string',
        example: '123456'
    })
    @ApiResponse({
        status: 200,
        description: 'User found successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'User found successfully' },
                data: {
                    type: 'object',
                    properties: {
                        register: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string' },
                        position: { type: 'string' },
                        sector: { type: 'string' }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Get(":register")
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    getUserByRegister(@Param("register") register: string) {
        return this.service.findOne(register);
    }

    @ApiOperation({ summary: 'Get user by email' })
    @ApiBearerAuth()
    @ApiParam({
        name: 'email',
        description: 'User email address',
        type: 'string',
        example: 'user@example.com'
    })
    @ApiResponse({
        status: 200,
        description: 'User found successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'User found successfully' },
                data: {
                    type: 'object',
                    properties: {
                        register: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string' },
                        position: { type: 'string' },
                        sector: { type: 'string' }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Get("/email/:email")
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    getUserByEmail(@Param("email") email: string) {
        return this.service.findByEmail(email);
    }
}
