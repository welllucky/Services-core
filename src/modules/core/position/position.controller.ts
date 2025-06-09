import { AllowRoles } from "@/utils/decorators";
import {
    Controller,
    Get,
    Param
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

    @Get(":id")
    async getPosition(@Param("id") id: string) {
        return this.position.get(id);
    }

    @Get("name/:name")
    async getPositionByName(@Param("name") name: string) {
        return this.position.getByName(name);
    }
}
