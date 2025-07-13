import { Sector } from "@/database/entities";
import { SectorRepository } from "@/repositories";
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PositionModule } from "../position/position.module";
import { SectorService } from "./sector.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Sector]),
        forwardRef(() => PositionModule),
    ],
    providers: [SectorService, SectorRepository],
    exports: [SectorService, SectorRepository],
})
export class SectorModule {}