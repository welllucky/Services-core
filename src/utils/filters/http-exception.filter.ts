import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from "@nestjs/common";
import { captureException } from "@sentry/nestjs";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        const formattedResponse = {
            error: {
                title: exception?.name,
                message: exception?.message,
            },
        };

        captureException(exception, {
            data: formattedResponse,
        });

        response.status(status).json({
            status: status,
            path: request.url,
            ...formattedResponse,
        });
    }
}
