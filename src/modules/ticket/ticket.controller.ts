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

@Controller("tickets")
export class TicketController {
  constructor(private readonly service: TicketService) {}

  @Get()
  getAll(
    @Headers("Authorization") token: string,
    @Query("page") page?: number,
    @Query("index") index?: number,
  ) {
    return this.service.getAll(token, { page, index });
  }

  @Get("search")
  search(@Headers("Authorization") token: string, @Query("term") term: string) {
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
  create(
    @Headers("Authorization") token: string,
    @Body() data: CreateTicketDto,
  ) {
    return this.service.create(token, data);
  }

  @Get(":id")
  getById(@Headers("Authorization") token: string, @Param("id") id: string) {
    return this.service.getById(token, id);
  }

  @Put(":id")
  update(
    @Headers("Authorization") token: string,
    @Param("id") id: string,
    @Body() data: UpdateTicketDto,
  ) {
    return this.service.update(token, id, data);
  }

  @Put(":id/close")
  close(@Headers("Authorization") token: string, @Param("id") id: string) {
    return this.service.close(token, id);
  }
}
