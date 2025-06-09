import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { RoleModule } from "./role/role.module";
import { SectorModule } from "./sector/sector.module";
import { PositionModule } from "./position/position.module";
import { SessionModule } from "./session/session.module";
import { TicketModule } from "./ticket/ticket.module";
import { UserModule } from "./user/user.module";

export const backofficeModules = [
    RoleModule,
    SectorModule,
    PositionModule,
    SessionModule,
    TicketModule,
    UserModule,
];

@Module({
    imports: [
        ...backofficeModules,
        RouterModule.register(
            backofficeModules.map((module) => ({
                path: "backoffice",
                module,
            })),
        ),
    ],
    exports: [...backofficeModules],
})
export class BackofficeModule {}
