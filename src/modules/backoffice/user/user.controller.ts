import { UserService } from "@/modules/shared/user";
import { CreateUserDTO, UpdateUserDTO } from "@/typing";
import { ALLOWED_BACKOFFICE_ROLES } from "@/utils";
import { AllowRoles } from "@/utils/decorators";
import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiTooManyRequestsResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";

@ApiTags('User Management')
@Controller("users")
export class UserController {
    constructor(private readonly service: UserService) {}

    @Get()
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    @ApiOperation({ summary: `Get all users (${ALLOWED_BACKOFFICE_ROLES.join("/")})` })
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'List of all users',
        schema: {
            type: 'array',
            items: {
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
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Forbidden - Insufficient permissions' })
    getAll() {
        return this.service.findAll();
    }

    @Get(":register")
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    @ApiOperation({ summary: `Get user by register (${ALLOWED_BACKOFFICE_ROLES.join("/")})` })
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
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Forbidden - Insufficient permissions' })
    @ApiNotFoundResponse({ description: 'User not found' })
    getUserByRegister(@Param("register") register: string) {
        return this.service.findOne(register);
    }

    @Get("/email/:email")
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    @ApiOperation({ summary: `Get user by email (${ALLOWED_BACKOFFICE_ROLES.join("/")})` })
    @ApiBearerAuth()
    @ApiParam({
        name: 'email',
        description: 'User email address',
        type: 'string',
        example: 'user@example.com'
    })
    @ApiOkResponse({
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
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Forbidden - Insufficient permissions' })
    @ApiNotFoundResponse({ description: 'User not found' })
    getUserByEmail(@Param("email") email: string) {
        return this.service.findByEmail(email);
    }

    @Post()
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    @Throttle({ default: { limit: 1, ttl: 60000 } })
    @ApiOperation({ summary: `Create new user (${ALLOWED_BACKOFFICE_ROLES.join("/")})` })
    @ApiBody({
        description: 'User creation data',
        schema: {
            type: 'object',
            properties: {
                register: { type: 'string', example: '123456' },
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john@example.com' },
                password: { type: 'string', example: 'securePassword123' },
                position: { type: 'string', example: 'Developer' },
                sector: { type: 'string', example: 'IT' }
            },
            required: ['register', 'name', 'email', 'password', 'position', 'sector']
        }
    })
    @ApiCreatedResponse({
        description: 'User created successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'User created successfully' },
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
    @ApiBadRequestResponse({ description: 'Bad Request - Invalid data' })
    @ApiConflictResponse({ description: 'Conflict - User already exists' })
    @ApiTooManyRequestsResponse({ description: 'Too Many Requests - Rate limit exceeded' })
    create(@Body() createUserDto: CreateUserDTO) {
        return this.service.create(createUserDto);
    }

    @Put(":register")
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    @ApiOperation({ summary: `Update user (${ALLOWED_BACKOFFICE_ROLES.join("/")})` })
    @ApiBearerAuth()
    @ApiParam({
        name: 'register',
        description: 'User register/ID to update',
        type: 'string',
        example: '123456'
    })
    @ApiBody({
        description: 'User update data',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'John Updated' },
                email: { type: 'string', example: 'john.updated@example.com' },
                position: { type: 'string', example: 'Senior Developer' },
                sector: { type: 'string', example: 'IT' }
            }
        }
    })
    @ApiOkResponse({
        description: 'User updated successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'User updated successfully' }
            }
        }
    })
    @ApiBadRequestResponse({ description: 'Bad Request - Invalid data' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiNotFoundResponse({ description: 'User not found' })
    update(
        @Param("register") register: string,
        @Body() updateUserDto: UpdateUserDTO,
    ) {
        this.service.update(register, updateUserDto);
    }

    // @Delete(":register")
    // remove(@Param("register") register: string) {
    //   this.service.remove(register);
    // }
}
