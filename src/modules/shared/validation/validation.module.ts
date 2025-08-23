import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Position, Sector } from "@/database/entities";
import { ValidationService } from "./validation.service";
import { PositionRepository } from "@/repositories/position.repository";
import { SectorRepository } from "@/repositories/sector.repository";

@Module({
    imports: [TypeOrmModule.forFeature([Position, Sector])],
    providers: [ValidationService, PositionRepository, SectorRepository],
    exports: [ValidationService],
})
export class ValidationModule {}