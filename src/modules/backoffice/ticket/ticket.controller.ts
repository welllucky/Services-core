import { UpdateTicketDto } from "@/typing";
import { AllowRoles } from "@/utils/decorators";
import {
    Body,
    Controller,
    Get,
    Headers,
    Param,
    Put,
    Query
} from "@nestjs/common";
import { TicketService } from "./ticket.service";

@Controller("tickets")
export class TicketController {
    constructor(private readonly service: TicketService) {}

    @Get()
    @AllowRoles(["admin", "manager"])
    getAll(
        @Headers("Authorization") token: string,
        @Query("page") page?: number,
        @Query("index") index?: number,
        @Query("isSolver") isSolver?: boolean,
    ) {
        return this.service.getAll(token, isSolver, { page, index });
    }

    @Get("search")
    @AllowRoles(["admin", "manager"])
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

    @Get(":id")
    @AllowRoles(["admin", "manager"])
    getById(
        @Headers("Authorization") token: string,
        @Param("id") id: string,
        @Query("isSolver") isSolver?: boolean,
    ) {
        return this.service.getById(token, id, isSolver);
    }

    @Put(":id")
    @AllowRoles(["admin", "manager"])
    update(
        @Headers("Authorization") token: string,
        @Param("id") id: string,
        @Body() data: UpdateTicketDto,
    ) {
        return this.service.update(token, id, data);
    }

    @Put(":id/resolve")
    @AllowRoles(["admin", "manager"])
    resolve(@Headers("Authorization") token: string, @Param("id") id: string) {
        return this.service.resolve(token, id);
    }
}
