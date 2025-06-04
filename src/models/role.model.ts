import { Roles, RolesSchema } from "@/typing";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
class RoleModel {
    private role: Roles | null = null;

    constructor(role: Roles) {
        this.set(role);
    }

    toString() {
        return this.role;
    }

    set(newRole: Roles) {
        const { success } = this.validate(true, newRole);


        if (newRole === this.role) {
            throw new BadRequestException("Role is the same");
        }

        if (!success) {
            throw new BadRequestException(`'${newRole}' is not a valid role`);
        }

        this.role = newRole;
    }

    validate(isSafe = false, role?: Roles): { success: boolean } {
        const reliable = role || this.role;

        if (!reliable) {
            if (!isSafe) throw new BadRequestException(`${role} is not a valid role`);
            return { success: false };
        }

        return RolesSchema.safeParse(reliable);
    }
}

export { RoleModel };
