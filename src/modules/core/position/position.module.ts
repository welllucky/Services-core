import { Module } from "@nestjs/common";
import { SharedPositionModule } from "@/modules/shared/position";

@Module({
    imports: [SharedPositionModule],
})
export class PositionModule {}
