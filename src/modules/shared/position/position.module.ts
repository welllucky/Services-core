import { Position } from "@/database/entities";
import { PositionRepository } from "@/repositories/position.repository";
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SectorModule } from "../sector/sector.module";
import { PositionService } from "./position.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Position]),
        forwardRef(() => SectorModule),
    ],
    providers: [PositionService, PositionRepository],
    exports: [PositionService, PositionRepository],
})
export class PositionModule {}