import { AccountService } from "@/modules/shared";
import { UserRepository } from "@/repositories/user.repository";
import { IResponseFormat, Roles, RolesSchema, UserWithSession } from "@/typing";
import { ALLOWED_BACKOFFICE_ROLES } from "@/utils";
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";

@Injectable()
export class RoleService {
    constructor(private readonly userRepository: UserRepository,
        private readonly accountService: AccountService
    ) {}

    getRoles() {
        return Object.values(RolesSchema.Values);
    }

    async changeRole(
        user: UserWithSession,
        targetUserRegister: string,
        newRole: Roles,
    ): Promise<IResponseFormat<null>> {
        const validationResult = RolesSchema.safeParse(newRole);
        if (!validationResult.success) {
            throw new BadRequestException(`'${newRole}' is not a valid role`);
        }

        const actualUser = await this.userRepository.findByRegister(user.register);
        const targetUser = await this.userRepository.findByRegister(targetUserRegister);

        if (!actualUser || !targetUser) {
            throw new ForbiddenException("User not found");
        }

        if (!ALLOWED_BACKOFFICE_ROLES.includes(actualUser.account.role)) {
            throw new ForbiddenException();
        }

        if (actualUser.register === targetUserRegister) {
            throw new ForbiddenException("You can't change your own role");
        }

        const targetAccount = await this.accountService.findByRegister(targetUserRegister);

        if (!targetAccount) {
            throw new ForbiddenException("User not found");
        }

        const { affected } = await this.accountService.updateRole(targetAccount.id, newRole);

        if (affected === 1) {
            return {
                message: "User role changed with success!",
            };
        }

        throw new InternalServerErrorException("Error on update user role.");
    }
}
