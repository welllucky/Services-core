import { Role, Sector } from "@/entities";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SectorController } from "./sector.controller";
import { SectorRepository } from "./sector.repository";
import { SectorService } from "./sector.service";

@Module({
  imports: [TypeOrmModule.forFeature([Sector, Role])],
  controllers: [SectorController],
  providers: [SectorService, SectorRepository],
})
export class SectorModule {}
