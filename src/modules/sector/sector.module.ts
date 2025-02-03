import { Sector } from "@/entities";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleModule } from "../role";
import { SectorController } from "./sector.controller";
import { SectorRepository } from "./sector.repository";
import { SectorService } from "./sector.service";

@Module({
  imports: [TypeOrmModule.forFeature([Sector]), RoleModule],
  controllers: [SectorController],
  providers: [SectorService, SectorRepository],
  exports: [SectorService, SectorRepository],
})
export class SectorModule {}
