import { SectorService } from "@/modules/shared/sector";
import { IsPublic } from "@/utils";
import {
    Controller,
    Get,
    Param
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Sector')
@Controller("sector")
export class SectorController {
    constructor(private readonly sectorService: SectorService) {}

    @Get()
    @IsPublic()
    @ApiOperation({ summary: 'Get all sectors' })
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


    @Get(":id")
    @IsPublic()
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
    @IsPublic()
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
    @IsPublic()
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
