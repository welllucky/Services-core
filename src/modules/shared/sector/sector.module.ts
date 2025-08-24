import { Position, Sector } from "@/database/entities";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SectorRepository } from "./sector.repository";
import { SectorService } from "./sector.service";
import { PositionRepository } from "../position";

@Module({
    imports: [
        TypeOrmModule.forFeature([Sector, Position]),
    ],
    providers: [SectorService, SectorRepository, PositionRepository],
    exports: [SectorService, SectorRepository],
})
export class SharedSectorModule {}