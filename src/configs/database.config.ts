import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
    url: process.env.DATABASE_URL,
    ...(process.env.DB_USERNAME && { username: process.env.DB_USERNAME }),
    ...(process.env.DB_PASSWORD && { password: process.env.DB_PASSWORD }),
    ...(process.env.DB_DATABASE && { database: process.env.DB_DATABASE }),
    ...(process.env.DB_HOST && { host: process.env.DB_HOST }),
    ...(process.env.DB_PORT && { port: Number(process.env.DB_PORT) }),
    ...(process.env.DB_CA && { ca: process.env.DB_CA }),
    ...(process.env.DB_DIALECT && {
        storage: process.env.DB_STORAGE ?? "services.sqlite",
    }),
    type: process.env.DB_DIALECT ?? "sqlite",
    logging: process.env.NODE_ENV === "development",
    migrationStorageTableName: `${process.env.DB_DIALECT ?? "sqlite"}-migrations-${process.env.NODE_ENV ?? "development"}`,
    synchronize: process.env.NODE_ENV === "development",
}));
