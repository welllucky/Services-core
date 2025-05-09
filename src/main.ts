import { ConfigService } from "@nestjs/config";
import { useContainer } from "class-validator";
import * as express from "express";
import { join } from "path";
import { AppModule } from "./app.module.js";
import "./instrument.js";
import { configureCors, createAppInstance, enableGlobalPipes, enableVersioning } from "./utils/functions";
import helmet from "helmet";

async function startTheService() {
  const hostEnv = process.env.HOST_ENV as "development" | "production";

  const app = await createAppInstance(hostEnv);

  app.use(helmet());

  // app.useLogger(new CustomLogger());
  const configService = app.get(ConfigService);
  const isDevelopment = configService.get("HOST_ENV") === "development";
  const clientApplicationUrl = configService.get("CLIENT_URL");

  configureCors(app, isDevelopment, clientApplicationUrl);

  app.use("/public", express.static(join(__dirname, "..", "public")));

  enableVersioning(app);

  enableGlobalPipes(app, isDevelopment);

  // app.useGlobalFilters(new HttpExceptionFilter());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(configService.get("PORT") ?? 4000);
}

startTheService();
