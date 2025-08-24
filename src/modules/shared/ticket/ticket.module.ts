import { Ticket } from "@/database/entities";
import { TicketRepository } from "@/modules/shared/ticket/ticket.repository";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SharedSectorModule } from "../sector/sector.module";
import { SharedUserModule } from "../user/user.module";
import { TicketService } from "./ticket.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Ticket]),
        SharedUserModule,
        SharedSectorModule,
    ],
    providers: [TicketService, TicketRepository],
    exports: [TicketService, TicketRepository],
})
export class SharedTicketModule {}