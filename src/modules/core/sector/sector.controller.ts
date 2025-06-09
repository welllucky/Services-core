import { SectorWithoutIdDto } from "@/typing";
import { AllowRoles } from "@/utils/decorators";
import {
    Body,
    Controller,
    Get,
    Param,
    Post
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

    @Get(":id/roles")
    async getPositions(@Param("id") sectorId: string) {
        return this.sectorService.getPositions(sectorId);
    }
}
