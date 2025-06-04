import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger("LoggerMiddleware", {
        timestamp: true,
    });

    use(req: Request, res: Response, next: NextFunction) {
        const log = `${req.method} ${req.originalUrl} ${res.statusCode} ${req.headers["user-agent"]}`;

        if (res.statusCode >= 400) {
            this.logger.error(log);
        } else {
            this.logger.log(log);
        }
        next();
    }
}
