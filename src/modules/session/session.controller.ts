import { SessionStatus } from "@/typing";
import {
  Body,
  Controller,
  Get,
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
  create(@Body() credentials: Record<string, string>) {
    return this.sessionService.create(credentials);
  }
}
