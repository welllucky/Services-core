import { Position } from "@/entities";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PositionRepository } from ".";
import { PositionController } from "./position.controller";
import { PositionService } from "./position.service";

@Module({
    imports: [TypeOrmModule.forFeature([Position])],
    controllers: [PositionController],
    providers: [PositionService, PositionRepository],
    exports: [PositionService, PositionRepository],
})
export class PositionModule {}
