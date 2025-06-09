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

    async findAll(): Promise<IResponseFormat<UserRestrictDTO[]>> {
        const users = await this.userRepository.findAll();

        return {
            message: `${users.length} users was found`,
            data: users.map((user) => new UserRestrictDTO(
                user?.name ?? "",
                user?.email ?? "",
                user?.position?.name ?? "",
                user?.sector?.name ?? "",
                user?.canCreateTicket ?? false,
                user?.canResolveTicket ?? false,
                user?.isBanned ?? false,
                user?.role ?? "user",
                user?.register ?? "",
            )),
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
                user?.canCreateTicket || false,
                user?.canResolveTicket || false,
                user?.isBanned || false,
                user?.role || "user",
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
                user?.canCreateTicket ?? false,
                user?.canResolveTicket ?? false,
                user?.isBanned ?? false,
                user?.role ?? "user",
                user?.register ?? "",
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
