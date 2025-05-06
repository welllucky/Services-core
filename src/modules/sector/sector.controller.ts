import { SectorWithoutIdDto, UpdateSectorDto } from "@/typing";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { SectorService } from "./sector.service";

@Controller("sector")
export class SectorController {
  constructor(private readonly sessionService: SectorService) {}

  @Get()
  getAll() {
    // @Query("index") index?: number, // @Query("page") page?: number,
    return this.sessionService.getAll();
  }

  @Post()
  create(@Body() data: SectorWithoutIdDto) {
    return this.sessionService.create(data);
  }

  @Get(":id")
  async getSector(@Param("id") id: string) {
    return this.sessionService.get(id);
  }

  @Get("name/:name")
  async getSectorByName(@Param("name") name: string) {
    return this.sessionService.getByName(name);
  }

  @Patch(":id")
  async updateSector(@Param("id") id: string, @Body() data: UpdateSectorDto) {
    return this.sessionService.update(id, data);
  }

  @Get(":id/roles")
  async getRoles(@Param("id") sectorId: string) {
    return this.sessionService.getRoles(sectorId);
  }

  @Delete(":id")
  async deleteSector(@Param("id") id: string) {
    return this.sessionService.removeSector(id);
  }

  @Post(":sector/addRole/:role")
  async addRole(
    @Param("sector") sectorName: string,
    @Param("role") roleName: string,
  ) {
    return this.sessionService.addRole(roleName, sectorName);
  }

  @Delete(":sector/removeRole/:role")
  async removeRole(
    @Param("sector") sectorName: string,
    @Param("role") roleName: string,
  ) {
    return this.sessionService.removeRole(roleName, sectorName);
  }
}
