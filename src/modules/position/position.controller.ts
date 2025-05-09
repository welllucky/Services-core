import { PositionWithoutIdDto, UpdatePositionDto } from "@/typing";
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
import { PositionService } from "./position.service";

@Controller("position")
export class PositionController {
    constructor(private readonly position: PositionService) {}

    @Get()
    @AllowRoles(["admin", "manager"])
    getAll() {
        // @Query("index") index?: number, // @Query("page") page?: number,
        return this.position.getAll();
    }

    @Post()
    @AllowRoles(["admin", "manager"])
    create(@Body() data: PositionWithoutIdDto) {
        return this.position.create(data);
    }

    @Get(":id")
    async getPosition(@Param("id") id: string) {
        return this.position.get(id);
    }

    @Get("name/:name")
    async getPositionByName(@Param("name") name: string) {
        return this.position.getByName(name);
    }

    @Patch(":id")
    @AllowRoles(["admin", "manager"])
    async updatePosition(
        @Param("id") id: string,
        @Body() data: UpdatePositionDto,
    ) {
        return this.position.update(id, data);
    }

    @Delete(":id")
    @AllowRoles(["admin", "manager"])
    async removePosition(@Param("id") id: string) {
        return this.position.remove(id);
    }
}
