import { SectorWithoutIdDto, UpdateSectorDto } from "@/typing";
import { AllowRoles } from "@/utils/decorators";
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
    constructor(private readonly sectorService: SectorService) {}

    @Get()
    @AllowRoles(["admin", "manager"])
    getAll() {
        // @Query("index") index?: number, // @Query("page") page?: number,
        return this.sectorService.getAll();
    }

    @Post()
    @AllowRoles(["admin", "manager"])
    create(@Body() data: SectorWithoutIdDto) {
        return this.sectorService.create(data);
    }

    @Get(":id")
    async getSector(@Param("id") id: string) {
        return this.sectorService.get(id);
    }

    @Get("name/:name")
    async getSectorByName(@Param("name") name: string) {
        return this.sectorService.getByName(name);
    }

    @Patch(":id")
    @AllowRoles(["admin", "manager"])
    async updateSector(@Param("id") id: string, @Body() data: UpdateSectorDto) {
        return this.sectorService.update(id, data);
    }

    @Get(":id/roles")
    async getPositions(@Param("id") sectorId: string) {
        return this.sectorService.getPositions(sectorId);
    }

    @Delete(":id")
    @AllowRoles(["admin", "manager"])
    async removeSector(@Param("id") id: string) {
        return this.sectorService.removeSector(id);
    }

    @Post(":sector/addPosition/:role")
    @AllowRoles(["admin", "manager"])
    async addPosition(
        @Param("sector") sectorName: string,
        @Param("role") roleName: string,
    ) {
        return this.sectorService.addPosition(roleName, sectorName);
    }

    @Delete(":sector/removePosition/:role")
    @AllowRoles(["admin", "manager"])
    async removePosition(
        @Param("sector") sectorName: string,
        @Param("role") roleName: string,
    ) {
        return this.sectorService.removePosition(roleName, sectorName);
    }
}
