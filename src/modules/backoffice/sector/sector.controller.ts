import { SectorWithoutIdDto, UpdateSectorDto } from "@/typing";
import { ALLOWED_BACKOFFICE_ROLES } from "@/utils";
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
import { SectorService } from "@/modules/shared/sector";

@ApiTags('Backoffice Sector Management')
@ApiBearerAuth()
@Controller("sector")
export class SectorController {
    constructor(private readonly sectorService: SectorService) {}

    @ApiOperation({ summary: 'Get all sectors (Admin/Manager)' })
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
    @Get()
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    getAll() {
        return this.sectorService.getAll();
    }

    @ApiOperation({ summary: 'Create new sector (Admin/Manager)' })
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
    @Post()
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    create(@Body() data: SectorWithoutIdDto) {
        return this.sectorService.create(data);
    }

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
    @Get(":id")
    async getSector(@Param("id") id: string) {
        return this.sectorService.get(id);
    }

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
    @Get("name/:name")
    async getSectorByName(@Param("name") name: string) {
        return this.sectorService.getByName(name);
    }

    @ApiOperation({ summary: 'Update sector (Admin/Manager)' })
    @ApiParam({ name: 'id', description: 'Sector ID', type: 'string', example: 'uuid-123' })
    @ApiBody({
        description: 'Sector update data',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Information Technology' },
                description: { type: 'string', example: 'Updated IT department sector' }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Sector updated successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Sector updated successfully' }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin/Manager only' })
    @ApiResponse({ status: 404, description: 'Sector not found' })
    @Patch(":id")
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    async updateSector(@Param("id") id: string, @Body() data: UpdateSectorDto) {
        return this.sectorService.update(id, data);
    }

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
    @Get(":id/roles")
    async getPositions(@Param("id") sectorId: string) {
        return this.sectorService.getPositions(sectorId);
    }

    @ApiOperation({ summary: 'Delete sector (Admin/Manager)' })
    @ApiParam({ name: 'id', description: 'Sector ID', type: 'string', example: 'uuid-123' })
    @ApiResponse({
        status: 200,
        description: 'Sector deleted successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Sector deleted successfully' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin/Manager only' })
    @ApiResponse({ status: 404, description: 'Sector not found' })
    @Delete(":id")
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    async removeSector(@Param("id") id: string) {
        return this.sectorService.removeSector(id);
    }

    @ApiOperation({ summary: 'Add position to sector (Admin/Manager)' })
    @ApiParam({ name: 'sector', description: 'Sector name', type: 'string', example: 'IT' })
    @ApiParam({ name: 'role', description: 'Position/Role name', type: 'string', example: 'Developer' })
    @ApiResponse({
        status: 200,
        description: 'Position added to sector successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Position added to sector successfully' }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin/Manager only' })
    @ApiResponse({ status: 404, description: 'Sector or position not found' })
    @Post(":sector/addPosition/:role")
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    async addPosition(
        @Param("sector") sectorName: string,
        @Param("role") roleName: string,
    ) {
        return this.sectorService.addPosition(roleName, sectorName);
    }

    @ApiOperation({ summary: 'Remove position from sector (Admin/Manager)' })
    @ApiParam({ name: 'sector', description: 'Sector name', type: 'string', example: 'IT' })
    @ApiParam({ name: 'role', description: 'Position/Role name', type: 'string', example: 'Developer' })
    @ApiResponse({
        status: 200,
        description: 'Position removed from sector successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Position removed from sector successfully' }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin/Manager only' })
    @ApiResponse({ status: 404, description: 'Sector or position not found' })
    @Delete(":sector/removePosition/:role")
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    async removePosition(
        @Param("sector") sectorName: string,
        @Param("role") roleName: string,
    ) {
        return this.sectorService.removePosition(roleName, sectorName);
    }
}
