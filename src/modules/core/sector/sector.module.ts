import { forwardRef, Module } from "@nestjs/common";
import { SectorModule as SharedSectorModule } from "@/modules/shared/sector";
import { PositionModule } from "../position/position.module";
import { UserModule } from "../user/user.module";
import { SectorController } from "./sector.controller";

@Module({
    imports: [
        SharedSectorModule,
        forwardRef(() => PositionModule),
        forwardRef(() => UserModule)
    ],
    controllers: [SectorController],
})
export class SectorModule {}
