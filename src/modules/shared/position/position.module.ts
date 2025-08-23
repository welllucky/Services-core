import { Position } from "@/database/entities";
import { PositionRepository } from "@/repositories/position.repository";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PositionService } from "./position.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Position]),
    ],
    providers: [PositionService, PositionRepository],
    exports: [PositionService, PositionRepository],
})
export class SharedPositionModule {}