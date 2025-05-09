import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";

export function enableGlobalPipes(
    app: NestExpressApplication,
    isDevelopment: boolean,
) {
    app.useGlobalPipes(
        new ValidationPipe({
            enableDebugMessages: isDevelopment,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );
}
