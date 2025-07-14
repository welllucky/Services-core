import { AllowRoles } from "@/utils/decorators";
import {
    Controller,
    Get,
    Param
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PositionService } from "@/modules/shared/position";

@ApiTags('Position Management')
@Controller("position")
export class PositionController {
    constructor(private readonly position: PositionService) {}

    @ApiOperation({ summary: 'Get all positions' })
    @ApiBearerAuth()
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
    @Get()
    @AllowRoles(["admin", "manager"])
    getAll() {
        return this.position.getAll();
    }

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
    @Get(":id")
    async getPosition(@Param("id") id: string) {
        return this.position.get(id);
    }

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
    @Get("name/:name")
    async getPositionByName(@Param("name") name: string) {
        return this.position.getByName(name);
    }
}
