import { GetSessionDTO, SessionStatus } from "@/typing";
import { AllowRoles, IsPublic } from "@/utils/decorators";
import {
    Body,
    Controller,
    Get,
    Headers,
    HttpCode,
    Post,
    Query,
} from "@nestjs/common";
import { SessionService } from "./session.service";

@Controller("sessions")
export class SessionController {
    constructor(private readonly service: SessionService) {}

    @Get()
    @AllowRoles(["admin", "manager"])
    getAll(
        @Headers("Authorization") accessToken: string,
        @Query("status") status?: SessionStatus,
        @Query("page") page?: number,
        @Query("index") index?: number,
    ) {
        return this.service.findAll(
            accessToken,
            {
                page,
                index,
            },
            status,
        );
    }

    @Post()
    @AllowRoles(["admin", "manager"])
    @IsPublic()
    create(@Body() credentials: GetSessionDTO) {
        return this.service.create(credentials);
    }

    @Post("refresh")
    @AllowRoles(["admin", "manager"])
    @HttpCode(501)
    @IsPublic()
    refresh() {
        // @Body() credentials: GetSessionDTO
        return "Not implemented";
    }

    @Post("close")
    @AllowRoles(["admin", "manager"])
    close(@Headers("Authorization") accessToken: string) {
        return this.service.close(accessToken);
    }
}
