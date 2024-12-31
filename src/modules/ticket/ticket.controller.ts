import { CreateTicketDto, UpdateTicketDto } from "@/typing";
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { TicketService } from "./ticket.service";

@Controller("tickets")
export class TicketController {
  constructor(private readonly service: TicketService) {}

  @Get()
  getAll(@Headers("Authorization") token: string) {
    return this.service.getAll(token);
  }

  @Get(":id")
  getByRegister(
    @Headers("Authorization") token: string,
    @Param("id") id: string,
  ) {
    return this.service.getById(token, id);
  }

  @Post()
  create(
    @Headers("Authorization") token: string,
    @Body() data: CreateTicketDto,
  ) {
    return this.service.create(token, data);
  }

  @Put(":id")
  update(
    @Headers("Authorization") token: string,
    @Param("id") id: string,
    @Body() data: UpdateTicketDto,
  ) {
    return this.service.update(token, id, data);
  }

  @Delete(":id")
  close(@Headers("Authorization") token: string, @Param("id") id: string) {
    return this.service.close(token, id);
  }
}
