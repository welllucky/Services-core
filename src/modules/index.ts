import { RoleModule } from "./role/role.module";
import { SectorModule } from "./sector/sector.module";
import { SessionModule } from "./session/session.module";
import { TicketModule } from "./ticket/ticket.module";
import { UserModule } from "./user/user.module";

export const modules = [
  UserModule,
  SessionModule,
  TicketModule,
  SectorModule,
  RoleModule,
];
