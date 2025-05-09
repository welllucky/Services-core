import { NestExpressApplication } from "@nestjs/platform-express";

export function configureCors(app: NestExpressApplication, isDevelopment: boolean, clientApplicationUrl: string) {
  app.enableCors({
    origin: isDevelopment ? "*" : clientApplicationUrl,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept", "Authorization"],
    credentials: false,
    optionsSuccessStatus: 204,
  });
}