import { UserModel } from "@/models/user.model";
import { UserRepository } from "@/repositories/user.repository";
import { IResponseFormat, Roles, RolesSchema } from "@/typing";
import { ALLOWED_BACKOFFICE_ROLES } from "@/utils";
import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";

@Injectable()
export class RoleService {
    constructor(private readonly userRepository: UserRepository) {}

    getRoles() {
        return Object.values(RolesSchema.Values);
    }

    async changeRole(
        token: string,
        targetUserRegister: string,
        newRole: Roles,
    ): Promise<IResponseFormat<null>> {
        const actualUser = new UserModel(this.userRepository);
        const targetUser = new UserModel(this.userRepository);

        await actualUser.init({
            accessToken: token,
        });

        await targetUser.init({
            register: targetUserRegister,
        });

        if (!ALLOWED_BACKOFFICE_ROLES.includes(actualUser.Role()?.toString() as Roles)) {
            throw new ForbiddenException();
        }

        if (actualUser.Register() === targetUserRegister) {
            throw new ForbiddenException("You can't change your own role");
        }

        targetUser.Role()?.set(newRole);

        const { affected } = await this.userRepository.updateRole(
            targetUser.Register() ?? "",
            newRole,
        );

        if (affected === 1) {
            return {
                message: "User role changed with success!",
            };
        }

        throw new InternalServerErrorException("Error on update user role.");
    }
}
