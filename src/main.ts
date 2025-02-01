import "./instrument.js";

// import { HttpExceptionFilter } from "@/utils";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  ExpressAdapter,
  NestExpressApplication,
} from "@nestjs/platform-express";
import { useContainer } from "class-validator";
import * as express from "express";
import { join } from "path";
import { AppModule } from "./app.module.js";

async function startTheService() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      logger: ["debug", "error", "log", "warn", "verbose"],
    },
  );

  app.enableCors({
    // origin: isDevelopment ? "*" : clientApplicationUrl,
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept", "Authorization"],
    credentials: false,
    optionsSuccessStatus: 204,
  });

  const configService = app.get(ConfigService);

  const isDevelopment = configService.get("HOST_ENV") === "development";
  // const clientApplicationUrl = configService.get("CLIENT_URL");

  app.use("/public", express.static(join(__dirname, "..", "public")));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

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

  // app.useGlobalFilters(new HttpExceptionFilter());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(configService.get("PORT") ?? 4000);

  // eslint-disable-next-line no-console
  console.log(`Server is running on: ${await app.getUrl()}`);
}

startTheService();
