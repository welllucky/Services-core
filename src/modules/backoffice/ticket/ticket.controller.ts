import { TicketService } from "@/modules/shared/ticket";
import { RequestWithUser, UpdateTicketDto } from "@/typing";
import { AllowRoles } from "@/utils/decorators";
import {
    Body,
    Controller,
    Get,
    Param,
    Put,
    Query,
    Req
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Backoffice Ticket Management')
@ApiBearerAuth()
@Controller("tickets")
export class TicketController {
    constructor(private readonly service: TicketService) {}

    @ApiOperation({ summary: 'Get all tickets (Admin/Manager)' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number', type: 'number' })
    @ApiQuery({ name: 'index', required: false, description: 'Page size', type: 'number' })
    @ApiQuery({ name: 'isSolver', required: false, description: 'Filter by solver tickets', type: 'boolean' })
    @ApiResponse({
        status: 200,
        description: 'List of all tickets',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            title: { type: 'string' },
                            status: { type: 'string' },
                            priority: { type: 'string' },
                            requester: { type: 'string' },
                            solver: { type: 'string' },
                            createdAt: { type: 'string' }
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin/Manager only' })
    @Get()
    @AllowRoles(["admin", "manager"])
    getAll(
        @Req() req: RequestWithUser,
        @Query("page") page?: number,
        @Query("index") index?: number,
        @Query("isSolver") isSolver?: boolean,
    ) {
        return this.service.getAll(req.user, isSolver, { page, index });
    }

    @ApiOperation({ summary: 'Search tickets (Admin/Manager)' })
    @ApiQuery({ name: 'term', description: 'Search term', type: 'string', example: 'bug report' })
    @ApiResponse({
        status: 200,
        description: 'Search results',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    status: { type: 'string' },
                    priority: { type: 'string' }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin/Manager only' })
    @Get("search")
    @AllowRoles(["admin", "manager"])
    search(
        @Req() req: RequestWithUser,
        @Query("term") term: string,
    ) {
        return this.service.search(req.user, term);
    }

    @ApiOperation({ summary: 'Get tickets in progress' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number', type: 'number' })
    @ApiQuery({ name: 'index', required: false, description: 'Page size', type: 'number' })
    @ApiResponse({
        status: 200,
        description: 'Tickets in progress',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            title: { type: 'string' },
                            status: { type: 'string', example: 'in_progress' },
                            solver: { type: 'string' }
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Get("/inProgress")
    getInProgress(
        @Req() req: RequestWithUser,
        @Query("page") page?: number,
        @Query("index") index?: number,
    ) {
        return this.service.findInProgress(req.user, { page, index });
    }

    @ApiOperation({ summary: 'Get ticket by ID (Admin/Manager)' })
    @ApiParam({ name: 'id', description: 'Ticket ID', type: 'string', example: 'uuid-123' })
    @ApiQuery({ name: 'isSolver', required: false, description: 'Get solver perspective', type: 'boolean' })
    @ApiResponse({
        status: 200,
        description: 'Ticket details',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                status: { type: 'string' },
                priority: { type: 'string' },
                requester: { type: 'object' },
                solver: { type: 'object' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin/Manager only' })
    @ApiResponse({ status: 404, description: 'Ticket not found' })
    @Get(":id")
    @AllowRoles(["admin", "manager"])
    getById(
        @Req() req: RequestWithUser,
        @Param("id") id: string,
        @Query("isSolver") isSolver?: boolean,
    ) {
        return this.service.getById(req.user, id, isSolver);
    }

    @ApiOperation({ summary: 'Update ticket (Admin/Manager)' })
    @ApiParam({ name: 'id', description: 'Ticket ID', type: 'string', example: 'uuid-123' })
    @ApiBody({
        description: 'Ticket update data',
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'Updated ticket title' },
                description: { type: 'string', example: 'Updated description' },
                priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
                solver: { type: 'string', example: 'solver-id' },
                status: { type: 'string', enum: ['open', 'in_progress', 'resolved', 'closed'] }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Ticket updated successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Ticket updated successfully' }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin/Manager only' })
    @ApiResponse({ status: 404, description: 'Ticket not found' })
    @Put(":id")
    @AllowRoles(["admin", "manager"])
    update(
        @Req() req: RequestWithUser,
        @Param("id") id: string,
        @Body() data: UpdateTicketDto,
    ) {
        return this.service.update(req.user, id, data);
    }

    @ApiOperation({ summary: 'Resolve ticket (Admin/Manager)' })
    @ApiParam({ name: 'id', description: 'Ticket ID', type: 'string', example: 'uuid-123' })
    @ApiResponse({
        status: 200,
        description: 'Ticket resolved successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Ticket resolved successfully' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin/Manager only' })
    @ApiResponse({ status: 404, description: 'Ticket not found' })
    @Put(":id/resolve")
    @AllowRoles(["admin", "manager"])
    resolve(@Req() req: RequestWithUser, @Param("id") id: string) {
        return this.service.resolve(req.user, id);
    }
}
