import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { IsPublic } from "../decorators";
import { getUserDataByToken, searchUserByRegister } from "../functions";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.get<boolean>(
            IsPublic,
            context.getHandler(),
        );

        if (isPublic) {
            return true;
        } else {
            const request = context.switchToHttp().getRequest<Request>();
            const accessToken = request.headers["authorization"];

            if (!accessToken) {
                throw new HttpException(
                    "User not authenticated",
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const { userData: outsideUserData } =
                await getUserDataByToken(accessToken);

            const userData = await searchUserByRegister(
                outsideUserData?.register,
            );

            const isDataValid =
                outsideUserData?.register === userData?.register &&
                outsideUserData?.isBanned === userData?.isBanned &&
                outsideUserData?.email === userData?.email &&
                // outsideUserData?.role === userData?.role &&
                outsideUserData?.name === userData?.name &&
                outsideUserData?.canCreateTicket ===
                    userData?.canCreateTicket &&
                outsideUserData?.canResolveTicket ===
                    userData?.canResolveTicket &&
                outsideUserData?.position === userData?.position &&
                outsideUserData?.sector === userData?.sector;

            return isDataValid;
        }
    }
}
