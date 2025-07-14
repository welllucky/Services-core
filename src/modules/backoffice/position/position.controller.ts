import { PositionWithoutIdDto, UpdatePositionDto } from "@/typing";
import { AllowRoles } from "@/utils/decorators";
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PositionService } from "@/modules/shared/position";

@ApiTags('Backoffice Position Management')
@ApiBearerAuth()
@Controller("position")
export class PositionController {
    constructor(private readonly position: PositionService) {}

    @Get()
    @AllowRoles(["admin", "manager"])
    @ApiOperation({ summary: 'Get all positions (Admin/Manager)' })
    @ApiResponse({
        status: 200,
        description: 'List of all positions',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string' }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin/Manager only' })
    getAll() {
        return this.position.getAll();
    }

    @Post()
    @AllowRoles(["admin", "manager"])
    @ApiOperation({ summary: 'Create new position (Admin/Manager)' })
    @ApiBody({
        description: 'Position creation data',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Senior Developer' },
                description: { type: 'string', example: 'Senior software developer position' }
            },
            required: ['name']
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Position created successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Position created successfully' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin/Manager only' })
    @ApiResponse({ status: 409, description: 'Conflict - Position already exists' })
    create(@Body() data: PositionWithoutIdDto) {
        return this.position.create(data);
    }

    @Get(":id")
    @ApiOperation({ summary: 'Get position by ID' })
    @ApiParam({ name: 'id', description: 'Position ID', type: 'string', example: 'uuid-123' })
    @ApiResponse({
        status: 200,
        description: 'Position details',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' }
            }
        }
    })
    @ApiResponse({ status: 404, description: 'Position not found' })
    async getPosition(@Param("id") id: string) {
        return this.position.get(id);
    }

    @Get("name/:name")
    @ApiOperation({ summary: 'Get position by name' })
    @ApiParam({ name: 'name', description: 'Position name', type: 'string', example: 'Developer' })
    @ApiResponse({
        status: 200,
        description: 'Position details',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' }
            }
        }
    })
    @ApiResponse({ status: 404, description: 'Position not found' })
    async getPositionByName(@Param("name") name: string) {
        return this.position.getByName(name);
    }

    @Patch(":id")
    @AllowRoles(["admin", "manager"])
    @ApiOperation({ summary: 'Update position (Admin/Manager)' })
    @ApiParam({ name: 'id', description: 'Position ID', type: 'string', example: 'uuid-123' })
    @ApiBody({
        description: 'Position update data',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Senior Developer' },
                description: { type: 'string', example: 'Updated description' }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Position updated successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Position updated successfully' }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin/Manager only' })
    @ApiResponse({ status: 404, description: 'Position not found' })
    async updatePosition(
        @Param("id") id: string,
        @Body() data: UpdatePositionDto,
    ) {
        return this.position.update(id, data);
    }

    @Delete(":id")
    @AllowRoles(["admin", "manager"])
    @ApiOperation({ summary: 'Delete position (Admin/Manager)' })
    @ApiParam({ name: 'id', description: 'Position ID', type: 'string', example: 'uuid-123' })
    @ApiResponse({
        status: 200,
        description: 'Position deleted successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Position deleted successfully' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin/Manager only' })
    @ApiResponse({ status: 404, description: 'Position not found' })
    async removePosition(@Param("id") id: string) {
        return this.position.remove(id);
    }
}
