import { Position, Sector } from "@/database/entities";
import { PositionRepository } from "@/modules/shared/position/position.repository";
import { SectorRepository } from "@/modules/shared/sector/sector.repository";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ValidationService } from "./validation.service";

@Module({
    imports: [TypeOrmModule.forFeature([Position, Sector])],
    providers: [ValidationService, PositionRepository, SectorRepository],
    exports: [ValidationService],
})
export class ValidationModule {}