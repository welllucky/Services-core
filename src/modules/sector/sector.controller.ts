import { SectorWithoutIdDto, UpdateSectorDto } from "@/typing";
import { IsPublic } from "@/utils";
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
    @IsPublic()
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
    @IsPublic()
    async getPositions(@Param("id") sectorId: string) {
        return this.sessionService.getPositions(sectorId);
    }

    @Delete(":id")
    async deleteSector(@Param("id") id: string) {
        return this.sessionService.removeSector(id);
    }

    @Post(":sector/addPosition/:role")
    async addPosition(
        @Param("sector") sectorName: string,
        @Param("role") roleName: string,
    ) {
        return this.sessionService.addPosition(roleName, sectorName);
    }

    @Delete(":sector/removePosition/:role")
    async removePosition(
        @Param("sector") sectorName: string,
        @Param("role") roleName: string,
    ) {
        return this.sessionService.removePosition(roleName, sectorName);
    }
}
