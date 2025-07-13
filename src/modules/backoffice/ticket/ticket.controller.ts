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

@Controller("tickets")
export class TicketController {
    constructor(private readonly service: TicketService) {}

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

    @Get("search")
    @AllowRoles(["admin", "manager"])
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

    @Get(":id")
    @AllowRoles(["admin", "manager"])
    getById(
        @Req() req: RequestWithUser,
        @Param("id") id: string,
        @Query("isSolver") isSolver?: boolean,
    ) {
        return this.service.getById(req.user, id, isSolver);
    }

    @Put(":id")
    @AllowRoles(["admin", "manager"])
    update(
        @Req() req: RequestWithUser,
        @Param("id") id: string,
        @Body() data: UpdateTicketDto,
    ) {
        return this.service.update(req.user, id, data);
    }

    @Put(":id/resolve")
    @AllowRoles(["admin", "manager"])
    resolve(@Req() req: RequestWithUser, @Param("id") id: string) {
        return this.service.resolve(req.user, id);
    }
}
