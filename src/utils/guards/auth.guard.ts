import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { getAuthToken } from "../functions";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const accessToken = request.headers["authorization"];

    console.log({
      request,
      accessToken,
    });

    getAuthToken({
      accessToken,
    }).then(() => {
      if (this.userModel.exists() && !this.userModel.isBanned()) {
        console.log("User found and is not banned");
        return true;
      }
    });

    console.log("User not found or is banned");
    return false;
  }
}
