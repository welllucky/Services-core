import { IResponseFormat } from "@/typing";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class FormatResponseMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const originalSend = res.send;

        res.send = function (body: unknown) {
            const parsedBody: IResponseFormat<
                Record<string, unknown> | Record<string, unknown>[]
            > = body ? JSON.parse(body as string) : null;

            const hasError = res.statusCode >= 400;

            const hasData =
                res.statusCode !== 204 &&
                !hasError &&
                (parsedBody?.data || Array.isArray(parsedBody));

            const resMessage =
                parsedBody?.message ||
                parsedBody?.error?.message ||
                (!hasError ? "Success" : "Error");

            const resTitle = parsedBody?.title || parsedBody?.error?.title;

            const formattedResponse = {
                ...(!hasError && { message: resMessage }),
                ...(hasData && { data: parsedBody?.data || parsedBody }),
                ...(hasError && {
                    error: {
                        title: resTitle,
                        message: resMessage,
                    },
                }),
                status: res.statusCode,
            };

            return originalSend.call(this, JSON.stringify(formattedResponse));
        };

        next();
    }
}
