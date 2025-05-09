import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { IsPublic } from "../utils/decorators";
import { getUserDataByToken, validUserData } from "../utils/functions";

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

            const isDataValid = await validUserData(outsideUserData);

            return isDataValid;
        }
    }
}
