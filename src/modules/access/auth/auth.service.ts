import { SessionRepository, UserRepository } from "@/repositories";
import { IResponseFormat, UserWithSession } from "@/typing";
import { comparePassword, TIME_TO_EXPIRE_THE_TOKEN } from "@/utils";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginResponseDto, ProfileResponseDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly sessionRepository: SessionRepository,
        private readonly jwtService: JwtService,
    ) {}

    async login(user: UserWithSession): Promise<IResponseFormat<LoginResponseDto>> {
        const expiresAt = new Date(Date.now() + TIME_TO_EXPIRE_THE_TOKEN);

        const session = await this.sessionRepository.create(user.id, expiresAt);

        if (!session) {
            throw new BadRequestException("Session not created");
        }

        const jwt = this.jwtService.sign({
            id: user.id,
            sessionId: session.id,
            register: user.register,
            email: user.email,
            name: user.name,
            position: user.position,
            sector: user.sector,
            role: user.role,
            isBanned: user.isBanned,
            canCreateTicket: user.canCreateTicket,
            canResolveTicket: user.canResolveTicket,
        });

        return {
           data: {
            accessToken: jwt,
            expiresAt,
           },
           message: "Login successful",
        };
    }

    async logout(register: string): Promise<void> {
        const lastActiveSession = await this.sessionRepository.findLastActiveByUserRegister(
            register,
        );

        if (!lastActiveSession) {
            throw new NotFoundException("Active session not found");
        }

        await this.sessionRepository.update(
            lastActiveSession.id,
            lastActiveSession.account.id,
            { isActive: false },
        );
    }

    async validateUser(
        email: string,
        password: string,
    ): Promise<UserWithSession | null> {
        const userData = await this.userRepository.findByEmail(email);

        if (!userData) {
            return null;
        }

        const { isValid } = await comparePassword(password, userData.account.hash);

        if (!isValid) {
            throw new BadRequestException("Invalid password");
        }

        return {
            sessionId: "",
            email: userData.email,
            register: userData.register,
            name: userData.name,
            position: userData.position?.name ?? "",
            sector: userData.sector?.name ?? "",
            role: userData.account.role,
            isBanned: userData.account.isBanned,
            canCreateTicket: userData.account.canCreateTicket,
            canResolveTicket: userData.account.canResolveTicket,
            id: userData.account.id,
        };
    }

    async getProfile(user: UserWithSession): Promise<IResponseFormat<ProfileResponseDto>> {
        return {
            data: {
            register: user.register,
            name: user.name,
            email: user.email,
            position: user.position,
            sector: user.sector,
            role: user.role,
            isBanned: user.isBanned,
            canCreateTicket: user.canCreateTicket,
            canResolveTicket: user.canResolveTicket,
            },
            message: "Profile retrieved successfully",
        };
    }
}
