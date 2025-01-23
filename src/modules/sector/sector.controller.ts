import { CreateSectorDto, RoleDto, UpdateSectorDto } from "@/typing";
import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { SectorService } from "./sector.service";

@Controller("sector")
export class SectorController {
  constructor(private readonly sessionService: SectorService) {}

  @Get()
  getAll() {
    // @Query("index") index?: number, // @Query("page") page?: number,
    return this.sessionService.getSectors();
  }

  @Post()
  create(@Body() data: CreateSectorDto) {
    return this.sessionService.create(data);
  }

  @Get(":id")
  async getSector(@Param("id") id: string) {
    return this.sessionService.getSector(id);
  }

  @Get("name/:name")
  async getSectorByName(@Param("name") name: string) {
    return this.sessionService.getSectorByName(name);
  }

  @Patch(":id")
  async updateSector(@Param("id") id: string, @Body() data: UpdateSectorDto) {
    return this.sessionService.updateSector(id, data);
  }

  @Post(":id/role")
  async addRole(@Param("id") id: string, @Body() data: RoleDto) {
    return this.sessionService.addRole(data, id);
  }
}
