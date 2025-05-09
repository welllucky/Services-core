import { VersioningType } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";

export function enableVersioning(app: NestExpressApplication) {
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });
}