import { Sector } from "@/entities";
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SectorRepository } from "../../../repositories/sector.repository";
import { PositionModule } from "../position/position.module";
import { UserModule } from "../user/user.module";
import { SectorController } from "./sector.controller";
import { SectorService } from "./sector.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Sector]),
        forwardRef(() => PositionModule),
        forwardRef(() => UserModule)
    ],
    controllers: [SectorController],
    providers: [SectorService, SectorRepository],
    exports: [SectorService, SectorRepository],
})
export class SectorModule {}
