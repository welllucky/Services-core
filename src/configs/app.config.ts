import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
    nodeEnv: process.env.NODE_ENV ?? "development",
    name: process.env.APP_NAME ?? "Services API Core",
    workingDirectory: process.env.PWD || process.cwd(),
    port: process.env.APP_PORT ?? 4000,
}));
