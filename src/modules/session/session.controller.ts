import { GetSessionDTO, SessionStatus } from "@/typing";
import { IsPublic } from "@/utils/decorators";
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
    constructor(private readonly sessionService: SessionService) {}

    @Get()
    getAll(
        @Headers("Authorization") accessToken: string,
        @Query("status") status?: SessionStatus,
        @Query("page") page?: number,
        @Query("index") index?: number,
    ) {
        return this.sessionService.findAll(
            accessToken,
            {
                page,
                index,
            },
            status,
        );
    }

    @Post()
    @IsPublic()
    create(@Body() credentials: GetSessionDTO) {
        return this.sessionService.create(credentials);
    }

    @Post("refresh")
    @HttpCode(501)
    @IsPublic()
    refresh() {
        // @Body() credentials: GetSessionDTO
        return "Not implemented";
    }

    @Post("close")
    close(@Headers("Authorization") accessToken: string) {
        return this.sessionService.close(accessToken);
    }
}
