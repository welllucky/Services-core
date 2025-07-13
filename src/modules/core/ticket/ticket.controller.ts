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

@Controller("tickets")
export class TicketController {
    constructor(private readonly service: TicketService) {}

    @Get()
    getAll(
        @Req() req: RequestWithUser,
        @Query("page") page?: number,
        @Query("index") index?: number,
        @Query("isSolver") isSolver?: boolean,
    ) {
        return this.service.getAll(req.user, isSolver, { page, index });
    }

    @Get("search")
    @DeniedRoles(["guest"])
    search(
        @Req() req: RequestWithUser,
        @Query("term") term: string,
    ) {
        return this.service.search(req.user, term);
    }

    @Get("/inProgress")
    getInProgress(
        @Req() req: RequestWithUser,
        @Query("page") page?: number,
        @Query("index") index?: number,
    ) {
        return this.service.findInProgress(req.user, { page, index });
    }

    @Post()
    @DeniedRoles(["guest", "viewer"])
    create(
        @Req() req: RequestWithUser,
        @Body() data: CreateTicketDto,
    ) {
        return this.service.create(req.user, data);
    }

    @Get(":id")
    @DeniedRoles(["guest"])
    getById(
        @Req() req: RequestWithUser,
        @Param("id") id: string,
        @Query("isSolver") isSolver?: boolean,
    ) {
        return this.service.getById(req.user, id, isSolver);
    }

    @Put(":id")
    @DeniedRoles(["guest", "viewer"])
    update(
        @Req() req: RequestWithUser,
        @Param("id") id: string,
        @Body() data: UpdateTicketDto,
    ) {
        return this.service.update(req.user, id, data);
    }

    @Put(":id/close")
    @DeniedRoles(["guest", "viewer"])
    close(@Req() req: RequestWithUser, @Param("id") id: string) {
        return this.service.close(req.user, id);
    }

    @Put(":id/start")
    @DeniedRoles(["guest", "viewer"])
    start(@Req() req: RequestWithUser, @Param("id") id: string) {
        return this.service.start(req.user, id);
    }

    @Put(":id/resolve")
    @DeniedRoles(["guest", "viewer"])
    resolve(@Req() req: RequestWithUser, @Param("id") id: string) {
        return this.service.resolve(req.user, id);
    }
}
