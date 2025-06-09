import { Ticket } from "@/entities";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketRepository } from "../../../repositories/ticket.repository";
import { UserModule } from "../user/user.module";
import { TicketController } from "./ticket.controller";
import { TicketService } from "./ticket.service";

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), UserModule],
  controllers: [TicketController],
  providers: [TicketService, TicketRepository],
  exports: [TicketService, TicketRepository],
})
export class TicketModule {}
