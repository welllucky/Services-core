import { SectorWithoutIdDto } from "@/typing";
import { AllowRoles } from "@/utils/decorators";
import {
    Body,
    Controller,
    Get,
    Param,
    Post
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SectorService } from "@/modules/shared/sector";

@ApiTags('Sector Management')
@Controller("sector")
export class SectorController {
    constructor(private readonly sectorService: SectorService) {}

    @Get()
    @AllowRoles(["admin", "manager"])
    @ApiOperation({ summary: 'Get all sectors' })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'List of all sectors',
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
        return this.sectorService.getAll();
    }

    @Post()
    @AllowRoles(["admin", "manager"])
    @ApiOperation({ summary: 'Create new sector' })
    @ApiBearerAuth()
    @ApiBody({
        description: 'Sector creation data',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Information Technology' },
                description: { type: 'string', example: 'IT department sector' }
            },
            required: ['name']
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Sector created successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Sector created successfully' },
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
    @ApiResponse({ status: 409, description: 'Conflict - Sector already exists' })
    create(@Body() data: SectorWithoutIdDto) {
        return this.sectorService.create(data);
    }

    @Get(":id")
    @ApiOperation({ summary: 'Get sector by ID' })
    @ApiParam({ name: 'id', description: 'Sector ID', type: 'string', example: 'uuid-123' })
    @ApiResponse({
        status: 200,
        description: 'Sector details',
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
    @ApiResponse({ status: 404, description: 'Sector not found' })
    async getSector(@Param("id") id: string) {
        return this.sectorService.get(id);
    }

    @Get("name/:name")
    @ApiOperation({ summary: 'Get sector by name' })
    @ApiParam({ name: 'name', description: 'Sector name', type: 'string', example: 'IT' })
    @ApiResponse({
        status: 200,
        description: 'Sector details',
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
    @ApiResponse({ status: 404, description: 'Sector not found' })
    async getSectorByName(@Param("name") name: string) {
        return this.sectorService.getByName(name);
    }

    @Get(":id/roles")
    @ApiOperation({ summary: 'Get positions in sector' })
    @ApiParam({ name: 'id', description: 'Sector ID', type: 'string', example: 'uuid-123' })
    @ApiResponse({
        status: 200,
        description: 'List of positions in the sector',
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
    @ApiResponse({ status: 404, description: 'Sector not found' })
    async getPositions(@Param("id") sectorId: string) {
        return this.sectorService.getPositions(sectorId);
    }
}
