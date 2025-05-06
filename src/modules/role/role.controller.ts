import { RoleWithoutIdDto, UpdateRoleDto } from "@/typing";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { RoleService } from "./role.service";

@Controller("role")
export class RoleController {
  constructor(private readonly role: RoleService) {}

  @Get()
  getAll() {
    // @Query("index") index?: number, // @Query("page") page?: number,
    return this.role.getAll();
  }

  @Post()
  create(@Body() data: RoleWithoutIdDto) {
    return this.role.create(data);
  }

  @Get(":id")
  async getRole(@Param("id") id: string) {
    return this.role.get(id);
  }

  @Get("name/:name")
  async getRoleByName(@Param("name") name: string) {
    return this.role.getByName(name);
  }

  @Patch(":id")
  async updateRole(@Param("id") id: string, @Body() data: UpdateRoleDto) {
    return this.role.update(id, data);
  }

  @Delete(":id")
  async removeRole(@Param("id") id: string) {
    return this.role.remove(id);
  }
}
