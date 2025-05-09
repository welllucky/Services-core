import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SentryModule } from "@sentry/nestjs/setup";
import { AppController } from "./app.controller";
import { configLoads } from "./configs";
import { entities } from "./entities";
import { FormatResponseMiddleware } from "./middlewares";
import { modules } from "./modules";
import { subscribers } from "./subscribers";
import { AuthGuard } from "./utils";

@Module({
    controllers: [AppController],
    imports: [
        SentryModule.forRoot(),
        ConfigModule.forRoot({
            envFilePath: [
                ".env.local",
                ".env.development",
                ".env.production",
                ".env",
            ],
            ignoreEnvFile: false,
            isGlobal: true,
            cache: true,
            load: configLoads,
            expandVariables: true,
            ignoreEnvVars: false,
        }),
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                type: "mysql",
                host: configService.get("DB_HOST"),
                port: configService.get("DB_PORT"),
                username: configService.get("DB_USERNAME"),
                password: configService.get("DB_PASSWORD"),
                database: configService.get("DB_NAME"),
                autoLoadEntities: true,
                synchronize: configService.get("HOST_ENV") === "development",
                entities: entities,
                subscribers: subscribers,
                ...(configService.get("DB_CA") && {
                    ssl: {
                        ca: configService.get("DB_CA"),
                    },
                }),
            }),
            inject: [ConfigService],
        }),
        ...modules,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(FormatResponseMiddleware).forRoutes("*");
    }
}
