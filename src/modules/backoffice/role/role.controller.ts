import { Roles, UserWithSession } from "@/typing";
import { ALLOWED_BACKOFFICE_ROLES, AllowRoles } from "@/utils";
import { Controller, Get, Param, Put, Request } from "@nestjs/common";
import { RoleService } from "./role.service";

@Controller("roles")
export class RoleController {
    constructor(private readonly service: RoleService) {}

    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    @Get()
    async getRoles() {
        return this.service.getRoles();
    }

    @AllowRoles(ALLOWED_BACKOFFICE_ROLES)
    @Put("change/:user/:newRole")
    async changeRole(
        @Param("user") userRegister: string,
        @Param("newRole") newRole: Roles,
        @Request() req: { user: UserWithSession },
    ) {
        return this.service.changeRole(req.user, userRegister, newRole);
    }
}
