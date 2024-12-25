import { AccessTokenDTO, GetSessionDTO, SessionStatus } from "@/typing";
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  // Headers,
  Query,
} from "@nestjs/common";
import { SessionService } from "./session.service";

@Controller("session")
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  getAll(
    // @Headers("Authorization") token: string,
    @Query("status") status?: SessionStatus,
  ) {
    return this.sessionService.findAll(
      //   token,
      status,
    );
  }

  @Post()
  create(@Body() credentials: GetSessionDTO) {
    return this.sessionService.create(credentials);
  }

  @Post("refresh")
  @HttpCode(501)
  refresh(@Body() credentials: GetSessionDTO) {
    return "Not implemented";
  }

  @Post("close")
  @HttpCode(204)
  close(@Headers("Authorization") token: AccessTokenDTO) {
    return this.sessionService.close(token);
  }
}
