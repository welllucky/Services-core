import { LogLevel } from "@nestjs/common";

export function createLoggerStrategy(applicationEnvironment?: "development" | "production") {
  const logStrategy = {
    development: ["log", "error", "warn", "debug", "verbose", "fatal"] as LogLevel[],
    production: ["log", "error", "warn", "fatal"] as LogLevel[],
  };

  return logStrategy[applicationEnvironment] || logStrategy.production;
}
