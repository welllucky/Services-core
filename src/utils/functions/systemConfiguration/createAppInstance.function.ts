import { AppModule } from "@/app.module";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter, NestExpressApplication } from "@nestjs/platform-express";
import { createLoggerStrategy } from "./createLoggerStrategy.function";

export async function createAppInstance(applicationEnvironment?: "development" | "production", hasLog = true) {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      bufferLogs: hasLog,
      logger: hasLog ? createLoggerStrategy(applicationEnvironment) : false,
    },
  );

  return app;
}