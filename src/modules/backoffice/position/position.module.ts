import { Position } from "@/entities";
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PositionRepository } from ".";
import { PositionController } from "./position.controller";
import { PositionService } from "./position.service";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Position]),
        forwardRef(() => UserModule)
    ],
    controllers: [PositionController],
    providers: [PositionService, PositionRepository],
    exports: [PositionService, PositionRepository],
})
export class PositionModule {}
