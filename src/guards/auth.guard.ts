import { getUserDataByToken, IsPublic, validUserData } from "@/utils";
import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

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
                getUserDataByToken(accessToken);

            if (!outsideUserData) {
                throw new HttpException(
                    "User not authenticated",
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const isDataValid = await validUserData(outsideUserData);

            return isDataValid;
        }
    }
}
