import { PositionModule } from "./position/position.module";
import { SectorModule } from "./sector/sector.module";
import { SessionModule } from "./session/session.module";
import { TicketModule } from "./ticket/ticket.module";
import { UserModule } from "./user/user.module";
import { SystemModule } from "./system/system.module";

export const modules = [
    UserModule,
    SessionModule,
    TicketModule,
    SectorModule,
    PositionModule,
    SystemModule,
];
