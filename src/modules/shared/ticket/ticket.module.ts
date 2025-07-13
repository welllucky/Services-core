import { Ticket } from "@/database/entities";
import { TicketRepository } from "@/repositories/ticket.repository";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SectorModule } from "../sector/sector.module";
import { UserModule } from "../user/user.module";
import { TicketService } from "./ticket.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Ticket]),
        UserModule,
        SectorModule,
    ],
    providers: [TicketService, TicketRepository],
    exports: [TicketService, TicketRepository],
})
export class TicketModule {}