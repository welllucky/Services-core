import { AccountRepository } from "@/repositories";
import {
    CreateUserDTO,
    IResponseFormat,
    Roles,
    UpdateAccountDTO,
    UserRestrictDTO,
    UserWithSession,
} from "@/typing";
import { encryptPassword } from "@/utils";
import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException
} from "@nestjs/common";
import { ValidationService } from "../validation/validation.service";

@Injectable()
export class AccountService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly validationService: ValidationService,
    ) {}

    async findById(id: string) {
        return this.accountRepository.findById(id);
    }

    async findByRegister(register: string) {
        return this.accountRepository.findByRegister(register);
    }

    async findByEmail(email: string) {
        return this.accountRepository.findByEmail(email);
    }

    async create(
        data: CreateUserDTO,
    ): Promise<IResponseFormat<UserRestrictDTO>> {
        const { position, sector } = await this.validationService.validatePositionAndSector(
            data.position,
            data.sector
        );

        const { hashedPassword } = encryptPassword(data.password);

        const createdUser = await this.accountRepository.create(
            { ...data, position: position.id, sector: sector.id },
            {
                isBanned: false,
                canCreateTicket: true,
                canResolveTicket: true,
                role: "user",
            },
            hashedPassword,
        );

        if (!createdUser) {
            throw new HttpException(
                {
                    title: "User not created",
                    message: "User was not created, please try again later",
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        return {
            title: "User created",
            message: "User was created successfully",
            data: new UserRestrictDTO(
                createdUser?.user.name,
                createdUser?.user.email,
                position.name,
                sector?.name,
                createdUser?.canCreateTicket,
                createdUser?.canResolveTicket,
                createdUser?.isBanned,
                createdUser?.role,
                createdUser?.user.register,
            ),
        };
    }

    async recover(user: UserWithSession, newPassword: string) {
        const { hashedPassword } = encryptPassword(newPassword);
        const account = await this.accountRepository.findByRegister(
            user.register,
        );

        if (!account) {
            throw new BadRequestException("Account not found");
        }

        const updatedAccount = await this.accountRepository.updateHash(account.id, hashedPassword);

        if (!updatedAccount) {
            throw new InternalServerErrorException(
                "Account was not updated, please try again later",
            );
        }

        return {
            title: "Password recovered",
            message: "Password was recovered successfully",
        };
    }

    async update(id: string, account: UpdateAccountDTO) {
        return this.accountRepository.update(id, account);
    }

    async updateRole(id: string, role: Roles) {
        return this.accountRepository.updateRole(id, role);
    }

    async delete(id: string) {
        return this.accountRepository.delete(id);
    }
}
