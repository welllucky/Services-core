import { Roles as RolesType } from "@/typing";
import { AllowRoles, DeniedRoles } from "@/utils/decorators";
import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

const unauthorizedBodyMessage = {
    title: "Unauthorized",
    message: "You are not authorized to access this resource.",
};

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const allowRoles = this.reflector.get<RolesType[]>(
            AllowRoles,
            context.getHandler(),
        );
        const deniedRoles = this.reflector.get<RolesType[]>(
            DeniedRoles,
            context.getHandler(),
        );

        if (!allowRoles?.length && !deniedRoles?.length) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const userRole = request?.user?.role;

        if (allowRoles?.includes(userRole)) {
            return true;
        }

        if (deniedRoles?.includes(userRole)) {
            throw new HttpException(
                unauthorizedBodyMessage,
                HttpStatus.UNAUTHORIZED,
            );
        }

        throw new HttpException(
            unauthorizedBodyMessage,
            HttpStatus.UNAUTHORIZED,
        );
    }
}
