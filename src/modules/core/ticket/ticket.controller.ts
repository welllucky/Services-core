import { TicketService } from "@/modules/shared/ticket";
import { CreateTicketDto, RequestWithUser, UpdateTicketDto } from "@/typing";
import { DeniedRoles } from "@/utils/decorators";
import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Ticket Management')
@ApiBearerAuth()
@Controller("tickets")
export class TicketController {
    constructor(private readonly service: TicketService) {}

    @ApiOperation({ summary: 'Get all tickets' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number', type: 'number' })
    @ApiQuery({ name: 'index', required: false, description: 'Page size', type: 'number' })
    @ApiQuery({ name: 'isSolver', required: false, description: 'Filter by solver tickets', type: 'boolean' })
    @ApiResponse({
        status: 200,
        description: 'List of tickets',
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
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        totalPages: { type: 'number' },
                        total: { type: 'number' }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Get()
    getAll(
        @Req() req: RequestWithUser,
        @Query("page") page?: number,
        @Query("index") index?: number,
        @Query("isSolver") isSolver?: boolean,
    ) {
        return this.service.getAll(req.user, isSolver, { page, index });
    }

    @ApiOperation({ summary: 'Search tickets' })
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
                    priority: { type: 'string' },
                    requester: { type: 'string' }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Guest role denied' })
    @Get("search")
    @DeniedRoles(["guest"])
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
                            priority: { type: 'string' },
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

    @ApiOperation({ summary: 'Create new ticket' })
    @ApiBody({
        description: 'Ticket creation data',
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'System error in login' },
                description: { type: 'string', example: 'Detailed description of the issue' },
                priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'], example: 'medium' },
                category: { type: 'string', example: 'bug' }
            },
            required: ['title', 'description', 'priority']
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Ticket created successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Ticket created successfully' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        status: { type: 'string', example: 'open' }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Guest or viewer role denied' })
    @Post()
    @DeniedRoles(["guest", "viewer"])
    create(
        @Req() req: RequestWithUser,
        @Body() data: CreateTicketDto,
    ) {
        return this.service.create(req.user, data);
    }

    @ApiOperation({ summary: 'Get ticket by ID' })
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
    @ApiResponse({ status: 403, description: 'Forbidden - Guest role denied' })
    @ApiResponse({ status: 404, description: 'Ticket not found' })
    @Get(":id")
    @DeniedRoles(["guest"])
    getById(
        @Req() req: RequestWithUser,
        @Param("id") id: string,
        @Query("isSolver") isSolver?: boolean,
    ) {
        return this.service.getById(req.user, id, isSolver);
    }

    @ApiOperation({ summary: 'Update ticket' })
    @ApiParam({ name: 'id', description: 'Ticket ID', type: 'string', example: 'uuid-123' })
    @ApiBody({
        description: 'Ticket update data',
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'Updated ticket title' },
                description: { type: 'string', example: 'Updated description' },
                priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
                solver: { type: 'string', example: 'solver-id' }
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
    @ApiResponse({ status: 403, description: 'Forbidden - Guest or viewer role denied' })
    @ApiResponse({ status: 404, description: 'Ticket not found' })
    @Put(":id")
    @DeniedRoles(["guest", "viewer"])
    update(
        @Req() req: RequestWithUser,
        @Param("id") id: string,
        @Body() data: UpdateTicketDto,
    ) {
        return this.service.update(req.user, id, data);
    }

    @ApiOperation({ summary: 'Close ticket' })
    @ApiParam({ name: 'id', description: 'Ticket ID', type: 'string', example: 'uuid-123' })
    @ApiResponse({
        status: 200,
        description: 'Ticket closed successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Ticket closed successfully' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Guest or viewer role denied' })
    @ApiResponse({ status: 404, description: 'Ticket not found' })
    @Put(":id/close")
    @DeniedRoles(["guest", "viewer"])
    close(@Req() req: RequestWithUser, @Param("id") id: string) {
        return this.service.close(req.user, id);
    }

    @ApiOperation({ summary: 'Start working on ticket' })
    @ApiParam({ name: 'id', description: 'Ticket ID', type: 'string', example: 'uuid-123' })
    @ApiResponse({
        status: 200,
        description: 'Ticket started successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Ticket started successfully' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Guest or viewer role denied' })
    @ApiResponse({ status: 404, description: 'Ticket not found' })
    @Put(":id/start")
    @DeniedRoles(["guest", "viewer"])
    start(@Req() req: RequestWithUser, @Param("id") id: string) {
        return this.service.start(req.user, id);
    }

    @ApiOperation({ summary: 'Resolve ticket' })
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
    @ApiResponse({ status: 403, description: 'Forbidden - Guest or viewer role denied' })
    @ApiResponse({ status: 404, description: 'Ticket not found' })
    @Put(":id/resolve")
    @DeniedRoles(["guest", "viewer"])
    resolve(@Req() req: RequestWithUser, @Param("id") id: string) {
        return this.service.resolve(req.user, id);
    }
}
