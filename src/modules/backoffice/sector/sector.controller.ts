import { SectorWithoutIdDto, UpdateSectorDto } from "@/typing";
import { ALLOWED_BACKOFFICE_ROLES } from "@/utils";
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
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    getAll() {
        // @Query("index") index?: number, // @Query("page") page?: number,
        return this.sectorService.getAll();
    }

    @Post()
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
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
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    async updateSector(@Param("id") id: string, @Body() data: UpdateSectorDto) {
        return this.sectorService.update(id, data);
    }

    @Get(":id/roles")
    async getPositions(@Param("id") sectorId: string) {
        return this.sectorService.getPositions(sectorId);
    }

    @Delete(":id")
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    async removeSector(@Param("id") id: string) {
        return this.sectorService.removeSector(id);
    }

    @Post(":sector/addPosition/:role")
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    async addPosition(
        @Param("sector") sectorName: string,
        @Param("role") roleName: string,
    ) {
        return this.sectorService.addPosition(roleName, sectorName);
    }

    @Delete(":sector/removePosition/:role")
    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    async removePosition(
        @Param("sector") sectorName: string,
        @Param("role") roleName: string,
    ) {
        return this.sectorService.removePosition(roleName, sectorName);
    }
}
