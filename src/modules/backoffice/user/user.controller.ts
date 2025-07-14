import { CreateUserDTO, UpdateUserDTO } from "@/typing";
import { AllowRoles, IsPublic } from "@/utils/decorators";
import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "@/modules/shared/user";

@ApiTags('Backoffice User Management')
@Controller("users")
export class UserController {
    constructor(private readonly service: UserService) {}

    @ApiOperation({ summary: 'Get all users' })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
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
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
    @Get()
    @AllowRoles(["admin", "manager"])
    getAll() {
        return this.service.findAll();
    }

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
    @AllowRoles(["admin", "manager"])
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
    @AllowRoles(["admin", "manager"])
    getUserByEmail(@Param("email") email: string) {
        return this.service.findByEmail(email);
    }

    @ApiOperation({ summary: 'Create new user' })
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
    @ApiResponse({
        status: 201,
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
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid data' })
    @ApiResponse({ status: 409, description: 'Conflict - User already exists' })
    @ApiResponse({ status: 429, description: 'Too Many Requests - Rate limit exceeded' })
    @IsPublic()
    @Throttle({ default: { limit: 1, ttl: 60000 } })
    @Post()
    create(@Body() createUserDto: CreateUserDTO) {
        return this.service.create(createUserDto);
    }

    @ApiOperation({ summary: 'Update user' })
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
    @ApiResponse({
        status: 200,
        description: 'User updated successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'User updated successfully' }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Put(":register")
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
