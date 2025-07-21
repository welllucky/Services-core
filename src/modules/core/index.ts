import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { AccountModule } from "./account/account.module";
import { PositionModule } from "./position/position.module";
import { SectorModule } from "./sector/sector.module";
import { SessionModule } from "./session/session.module";
import { TicketModule } from "./ticket/ticket.module";
import { UserModule } from "./user/user.module";

// Create modules without forwardRef for router configuration
const coreModules = [
    UserModule,
    SessionModule,
    TicketModule,
    SectorModule,
    PositionModule,
    AccountModule,
];

@Module({
    imports: [
        ...coreModules,
        RouterModule.register(coreModules.map((module) => ({
            path: "core",
            module,
        }))),
    ],
    exports: coreModules,
})
export class CoreModule {}