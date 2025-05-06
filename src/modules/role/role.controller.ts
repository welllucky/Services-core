import { RoleWithoutIdDto, UpdateRoleDto } from "@/typing";
import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { RoleService } from "./role.service";

@Controller("role")
export class RoleController {
  constructor(private readonly sessionService: RoleService) {}

  @Get()
  getAll() {
    // @Query("index") index?: number, // @Query("page") page?: number,
    return this.sessionService.getRoles();
  }

  @Post()
  create(@Body() data: RoleWithoutIdDto) {
    return this.sessionService.create(data);
  }

  @Get(":id")
  async getRole(@Param("id") id: string) {
    return this.sessionService.getRole(id);
  }

  @Get("name/:name")
  async getRoleByName(@Param("name") name: string) {
    return this.sessionService.getRoleByName(name);
  }

  @Patch(":id")
  async updateRole(@Param("id") id: string, @Body() data: UpdateRoleDto) {
    return this.sessionService.updateRole(id, data);
  }
}
