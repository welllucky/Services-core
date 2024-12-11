import "./instrument";

import { VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  ExpressAdapter,
  NestExpressApplication,
} from "@nestjs/platform-express";
import { AppModule } from "src/modules/app/app.module";
import { LoggerMiddleware } from "src/utils/middleware";

async function startTheService() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const configService = app.get(ConfigService);

  app.use([LoggerMiddleware]);

  const port = configService.get("PORT");

  await app.listen(port ?? 4000);

  console.log(`Server is running on: ${await app.getUrl()}`);
}

startTheService();
