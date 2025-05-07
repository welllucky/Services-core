import { UserModel } from "@/modules/user/user.model";
import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { getUserDataByToken } from "../functions";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(readonly userModel: UserModel) {}
    async use(req: Request, res: Response) {
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        const { userData } = await getUserDataByToken(accessToken);
        await this.userModel.init({ register: userData.register });

        if (!this.userModel.exists()) {
            return res.status(HttpStatus.FORBIDDEN).json({
                error: { message: "Forbidden", title: "Access denied" },
                status: HttpStatus.FORBIDDEN,
            });
        }

        req.next();
    }
}
