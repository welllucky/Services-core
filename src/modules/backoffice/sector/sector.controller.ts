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

    @Get()
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
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
    getAll() {
        return this.sectorService.getAll();
    }

    @Post()
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
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

    @Patch(":id")
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
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
    async updateSector(@Param("id") id: string, @Body() data: UpdateSectorDto) {
        return this.sectorService.update(id, data);
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

    @Delete(":id")
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
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
    async removeSector(@Param("id") id: string) {
        return this.sectorService.removeSector(id);
    }

    @Post(":sector/addPosition/:role")
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
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
    async addPosition(
        @Param("sector") sectorName: string,
        @Param("role") roleName: string,
    ) {
        return this.sectorService.addPosition(roleName, sectorName);
    }

    @Delete(":sector/removePosition/:role")
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
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
    async removePosition(
        @Param("sector") sectorName: string,
        @Param("role") roleName: string,
    ) {
        return this.sectorService.removePosition(roleName, sectorName);
    }
}
