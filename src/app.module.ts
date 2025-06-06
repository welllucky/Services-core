import { entities } from "@/entities";
import {
    BackofficeModule,
    configLoads,
    CoreModule,
    FormatResponseMiddleware,
    guards,
    LoggerMiddleware,
    TrackUserMiddleware,
} from "@/modules";
import { subscribers } from "@/subscribers";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SentryModule } from "@sentry/nestjs/setup";
import { AppController } from "./app.controller";

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
                entities,
                subscribers: subscribers,
                ...(configService.get("DB_CA") && {
                    ssl: {
                        ca: configService.get("DB_CA"),
                    },
                }),
            }),
            inject: [ConfigService],
        }),
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    name: "short",
                    ttl: 1000,
                    limit: 3,
                },
                {
                    name: "medium",
                    ttl: 10000,
                    limit: 20,
                },
                {
                    name: "long",
                    ttl: 60000,
                    limit: 50,
                },
            ],
        }),
        CoreModule,
        BackofficeModule,
    ],
    providers: [...guards],
    exports: [CoreModule, BackofficeModule],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                TrackUserMiddleware,
                FormatResponseMiddleware,
                LoggerMiddleware,
            )
            .forRoutes("*");
    }
}
