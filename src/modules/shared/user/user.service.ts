import { UserRepository } from "@/repositories/user.repository";
import {
    CreateUserDTO,
    IResponseFormat,
    UpdateUserDTO,
    UserRestrictDTO
} from "@/typing";
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PositionService } from "../position/position.service";
import { SectorService } from "../sector/sector.service";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        @Inject(forwardRef(() => PositionService))
        private readonly positionService: PositionService,
        @Inject(forwardRef(() => SectorService))
        private readonly sectorService: SectorService,
    ) {}

    async create(
        data: CreateUserDTO,
    ): Promise<IResponseFormat<UserRestrictDTO>> {
        const position = (await this.positionService.getByName(data.position))
            ?.data;
        const sector = (await this.sectorService.getByName(data.sector))?.data;
        const positions = (
            await this.sectorService.getPositionsByName(data.sector)
        )?.data;

        const existPositionInSector = positions?.find(
            (r) => r.id === position?.id,
        );

        if (!sector || !position) {
            throw new HttpException(
                {
                    title: "Sector or position not found",
                    message:
                        "Sector or position not found, please check the sector and position.",
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!existPositionInSector) {
            throw new HttpException(
                {
                    title: "Position not found in sector",
                    message:
                        "Position not found in sector, please check the position and sector.",
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const createdUser = await this.userRepository.create(
            { ...data, position: position.id, sector: sector.id },
            data.password,
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
                createdUser?.name,
                createdUser?.email,
                position.name,
                sector?.name,
                createdUser?.account?.isBanned,
                createdUser?.account?.canCreateTicket,
                createdUser?.account?.canResolveTicket,
                createdUser?.account?.role,
                createdUser?.register,
            ),
        };
    }

    async findAll(): Promise<IResponseFormat<UserRestrictDTO[]>> {
        const users = await this.userRepository.findAll();

        if (!users?.length) {
            throw new HttpException(
                {
                    title: "Users not found",
                    message: "No users found.",
                },
                HttpStatus.NOT_FOUND,
            );
        }

        return {
            message: `${users.length} user(s) found`,
            data: users.map((user) => new UserRestrictDTO(
                user?.name ?? "",
                user?.email ?? "",
                user?.position?.name ?? "",
                user?.sector?.name ?? "",
                user?.account?.canCreateTicket ?? false,
                user?.account?.canResolveTicket ?? false,
                user?.account?.isBanned ?? false,
                user?.account?.role ?? "user",
                user?.register ?? "",
            )),
        };
    }

    async findByRegister(register: string): Promise<UserRestrictDTO> {
        const user = await this.userRepository.findByRegister(register);

        if (!user) {
            throw new HttpException(
                {
                    title: "User not found",
                    message: `User with register "${register}" not found.`,
                },
                HttpStatus.NOT_FOUND,
            );
        }

        return new UserRestrictDTO(
            user.name,
            user.email,
            user.position?.name ?? "",
            user.sector?.name ?? "",
            user.account?.canCreateTicket,
            user.account?.canResolveTicket,
            user.account?.isBanned,
            user.account?.role,
            user.register,
        );
    }

    async update(register: string, userData: UpdateUserDTO): Promise<IResponseFormat<UserRestrictDTO>> {
        const existingUser = await this.userRepository.findByRegister(register);

        if (!existingUser) {
            throw new HttpException(
                {
                    title: "User not found",
                    message: `User with register "${register}" not found.`,
                },
                HttpStatus.NOT_FOUND,
            );
        }

        const { position, sector, ...updateData } = userData;

        let positionData, sectorData;

        if (position) {
            positionData = await this.positionService.findByName(position);
            if (!positionData) {
                throw new HttpException(
                    {
                        title: "Position not found",
                        message: `Position "${position}" not found.`,
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
        }

        if (sector) {
            sectorData = await this.sectorService.findByName(sector);
            if (!sectorData) {
                throw new HttpException(
                    {
                        title: "Sector not found",
                        message: `Sector "${sector}" not found.`,
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
        }

        const updatedUser = await this.userRepository.update(register, {
            ...updateData,
            ...(positionData && { position: positionData.name }),
            ...(sectorData && { sector: sectorData.name }),
        });

        if (!updatedUser.affected) {
            throw new HttpException(
                {
                    title: "User could not be updated",
                    message:
                        "Occurred an error while updating the user, please try again later.",
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        const user = await this.userRepository.findByRegister(register);

        return {
            message: "User updated successfully",
            data: new UserRestrictDTO(
                user!.name,
                user!.email,
                user!.position?.name ?? "",
                user!.sector?.name ?? "",
                user!.account?.canCreateTicket,
                user!.account?.canResolveTicket,
                user!.account?.isBanned,
                user!.account?.role,
                user!.register,
            ),
        };
    }

    async delete(register: string): Promise<IResponseFormat<null>> {
        const user = await this.userRepository.findByRegister(register);

        if (!user) {
            throw new HttpException(
                {
                    title: "User not found",
                    message: `User with register "${register}" not found.`,
                },
                HttpStatus.NOT_FOUND,
            );
        }

        const deletedUser = await this.userRepository.delete(register);

        if (!deletedUser.affected) {
            throw new HttpException(
                {
                    title: "User could not be deleted",
                    message:
                        "Occurred an error while deleting the user, please try again later.",
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            message: "User deleted successfully",
            data: null,
        };
    }

    async findOne(
        register: string,
        safe = false,
    ): Promise<IResponseFormat<UserRestrictDTO>> {
        const user = await this.userRepository.findByRegister(register);
        if (!user && !safe) {
            throw new HttpException(
                {
                    title: "User not found",
                    message: "User was not found, please check if user exist.",
                },
                HttpStatus.NO_CONTENT,
            );
        }

        return {
            message: "User was found",
            data: new UserRestrictDTO(
                user?.name || "",
                user?.email || "",
                user?.position?.name || "",
                user?.sector?.name || "",
                user?.account?.canCreateTicket || false,
                user?.account?.canResolveTicket || false,
                user?.account?.isBanned || false,
                user?.account?.role || "user",
                user?.register || "",
            ),
        };
    }

    async findByEmail(
        email: string,
        safe = false,
    ): Promise<IResponseFormat<UserRestrictDTO>> {
        const user = await this.userRepository.findByEmail(email);
        if (!user && !safe) {
            throw new HttpException(
                {
                    title: "User not found",
                    message: "User not found by email, please check the email.",
                },
                HttpStatus.NO_CONTENT,
            );
        }

        return {
            message: "User was found",
            data: new UserRestrictDTO(
                user?.name ?? "",
                user?.email ?? "",
                user?.position?.name ?? "",
                user?.sector?.name ?? "",
                user?.account?.canCreateTicket ?? false,
                user?.account?.canResolveTicket ?? false,
                user?.account?.isBanned ?? false,
                user?.account?.role ?? "user",
                user?.register ?? "",
            ),
        };
    }
}