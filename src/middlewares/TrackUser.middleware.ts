import { IUser } from "@/typing";
import { getUserDataByToken } from "@/utils";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class TrackUserMiddleware implements NestMiddleware {

   use(req: Request & {
    user?: IUser
  }, res: Response, next: NextFunction) {
    const accessToken = req.headers["authorization"];

    if (!accessToken) {
      return next();
    }

    const { userData } = getUserDataByToken(accessToken);

    if (userData) {
        req.user = userData;
    }

    next();
  }
}
