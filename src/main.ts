import "./instrument.js";

import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  ExpressAdapter,
  NestExpressApplication,
} from "@nestjs/platform-express";
import { AppModule } from "./app.module.js";
import { LoggerMiddleware } from "./middleware/logger.middleware.js";

async function startTheService() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );

  const configService = app.get(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: configService.get("HOST_ENV") === "development",
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use([LoggerMiddleware]);

  await app.listen(configService.get("PORT") ?? 4000);

  console.log(`Server is running on: ${await app.getUrl()}`);
}

startTheService();
