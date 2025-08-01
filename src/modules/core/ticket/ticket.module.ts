import { Module } from "@nestjs/common";
import { TicketModule as SharedTicketModule } from "@/modules/shared/ticket";
import { UserModule } from "../user/user.module";
import { TicketController } from "./ticket.controller";

@Module({
  imports: [SharedTicketModule, UserModule],
  controllers: [TicketController],
})
export class TicketModule {}
