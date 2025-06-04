import { Roles } from "@/typing";
import { ALLOWED_BACKOFFICE_ROLES, AllowRoles } from "@/utils";
import { Controller, Get, Headers, Param, Put } from "@nestjs/common";
import { RoleService } from "./role.service";

@Controller("roles")
export class RoleController {
    constructor(private readonly service: RoleService) {}

    @AllowRoles(ALLOWED_BACKOFFICE_ROLES as Roles[])
    @Get()
    async getRoles() {
        return this.service.getRoles();
    }

    @AllowRoles(ALLOWED_BACKOFFICE_ROLES as Roles[])
    @Put("change/:user/:newRole")
    async changeRole(
        @Param("user") user: string,
        @Param("newRole") newRole: Roles,
        @Headers("Authorization") token: string,
    ) {
        return this.service.changeRole(token, user, newRole);
    }
}
