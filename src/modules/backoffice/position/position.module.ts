import { SharedPositionModule } from "@/modules/shared/position";
import { Module } from "@nestjs/common";
import { PositionController } from "./position.controller";

@Module({
    imports: [SharedPositionModule],
    controllers: [PositionController],
})
export class PositionModule {}
