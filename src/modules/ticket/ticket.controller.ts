import { CreateTicketDto, UpdateTicketDto } from "@/typing";
import {
    Body,
    Controller,
    Get,
    Headers,
    Param,
    Post,
    Put,
    Query,
} from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { DeniedRoles } from "@/utils/decorators";

@Controller("tickets")
export class TicketController {
    constructor(private readonly service: TicketService) {}

    @Get()
    getAll(
        @Headers("Authorization") token: string,
        @Query("page") page?: number,
        @Query("index") index?: number,
        @Query("isSolver") isSolver?: boolean,
    ) {
        return this.service.getAll(token, isSolver, { page, index });
    }

    @Get("search")
    @DeniedRoles(["guest"])
    search(
        @Headers("Authorization") token: string,
        @Query("term") term: string,
    ) {
        return this.service.search(token, term);
    }

    @Get("/inProgress")
    getInProgress(
        @Headers("Authorization") token: string,
        @Query("page") page?: number,
        @Query("index") index?: number,
    ) {
        return this.service.findInProgress(token, { page, index });
    }

    @Post()
    @DeniedRoles(["guest", "viewer"])
    create(
        @Headers("Authorization") token: string,
        @Body() data: CreateTicketDto,
    ) {
        return this.service.create(token, data);
    }

    @Get(":id")
    @DeniedRoles(["guest"])
    getById(
        @Headers("Authorization") token: string,
        @Param("id") id: string,
        @Query("isSolver") isSolver?: boolean,
    ) {
        return this.service.getById(token, id, isSolver);
    }

    @Put(":id")
    @DeniedRoles(["guest", "viewer"])
    update(
        @Headers("Authorization") token: string,
        @Param("id") id: string,
        @Body() data: UpdateTicketDto,
    ) {
        return this.service.update(token, id, data);
    }

    @Put(":id/close")
    @DeniedRoles(["guest", "viewer"])
    close(@Headers("Authorization") token: string, @Param("id") id: string) {
        return this.service.close(token, id);
    }

    @Put(":id/start")
    @DeniedRoles(["guest", "viewer"])
    start(@Headers("Authorization") token: string, @Param("id") id: string) {
        return this.service.start(token, id);
    }

    @Put(":id/resolve")
    @DeniedRoles(["guest", "viewer"])
    resolve(@Headers("Authorization") token: string, @Param("id") id: string) {
        return this.service.resolve(token, id);
    }
}
