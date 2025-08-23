import { Position, Sector } from "@/database/entities";
import { PositionRepository, SectorRepository } from "@/repositories";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SectorService } from "./sector.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Sector, Position]),
    ],
    providers: [SectorService, SectorRepository, PositionRepository],
    exports: [SectorService, SectorRepository],
})
export class SharedSectorModule {}