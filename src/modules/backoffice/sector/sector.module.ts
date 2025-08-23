import { Module } from "@nestjs/common";
import { SharedSectorModule } from "@/modules/shared/sector";
import { SectorController } from "./sector.controller";

@Module({
    imports: [SharedSectorModule],
    controllers: [SectorController],
})
export class SectorModule {}
