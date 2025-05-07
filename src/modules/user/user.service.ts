import {
    CreateUserDTO,
    IResponseFormat,
    Pagination,
    UpdateUserDTO,
    UserPublicDTO,
    UserRestrictDTO,
} from "@/typing";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PositionService } from "../position/position.service";
import { SectorService } from "../sector/sector.service";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly positionService: PositionService,
        private readonly sectorService: SectorService,
    ) {}

    async findAll(
        pagination?: Pagination,
        safe: boolean = false,
    ): Promise<IResponseFormat<UserPublicDTO[]>> {
        const users = await this.userRepository.findAll(pagination);
        if (!users.length && !safe) {
            throw new HttpException(
                {
                    title: "Users not found",
                    message: "No users actives in the system",
                },
                HttpStatus.NO_CONTENT,
            );
        }

        return {
            title: "Users was found",
            message: "All users actives in the system",
            data: users.map(
                (user) =>
                    new UserPublicDTO(
                        user?.name,
                        user?.email,
                        user?.position?.name,
                        user?.sector?.name,
                        user?.canCreateTicket,
                        user?.canResolveTicket,
                        user?.isBanned,
                        user?.role,
                        user?.register,
                    ),
            ),
        };
    }

    async findOne(
        register: string,
        safe: boolean = false,
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
                user?.name,
                user?.email,
                user?.position?.name,
                user?.sector?.name,
                user?.canCreateTicket,
                user?.canResolveTicket,
                user?.isBanned,
                user?.role,
                user?.register,
            ),
        };
    }

    async findByEmail(
        email: string,
        safe: boolean = false,
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
                user?.name,
                user?.email,
                user?.position?.name,
                user?.sector?.name,
                user?.canCreateTicket,
                user?.canResolveTicket,
                user?.isBanned,
                user?.role,
                user?.register,
            ),
        };
    }

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
            (r) => r.id === position.id,
        );

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
                createdUser?.isBanned,
                createdUser?.canCreateTicket,
                createdUser?.canResolveTicket,
                createdUser?.role,
                createdUser?.register,
            ),
        };
    }

    async update(id: string, data: UpdateUserDTO) {
        const updatedUser = await this.userRepository.update(id, data);

        if (!updatedUser) {
            throw new HttpException(
                {
                    title: "User not updated",
                    message: "User was not updated, please try again later",
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            message: "User updated successfully",
        };
    }
}
