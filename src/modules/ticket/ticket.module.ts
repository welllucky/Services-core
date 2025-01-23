import { Ticket } from "@/entities";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user";
import { TicketController } from "./ticket.controller";
import { TicketRepository } from "./ticket.repository";
import { TicketService } from "./ticket.service";

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), UserModule],
  controllers: [TicketController],
  providers: [TicketService, TicketRepository],
  exports: [TicketService, TicketRepository],
})
export class TicketModule {}
