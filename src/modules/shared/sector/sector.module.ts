import { Sector } from "@/database/entities";
import { SectorRepository } from "@/repositories";
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SharedPositionModule } from "../position/position.module";
import { SectorService } from "./sector.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Sector]),
        forwardRef(() => SharedPositionModule),
    ],
    providers: [SectorService, SectorRepository],
    exports: [SectorService, SectorRepository],
})
export class SharedSectorModule {}