import { entities } from "@/database/entities";
import { subscribers } from "@/database/subscribers";
import {
    AccessModule,
    BackofficeModule,
    configLoads,
    CoreModule,
} from "@/modules";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SentryModule } from "@sentry/nestjs/setup";
import { AppController } from "./app.controller";
import { FormatResponseMiddleware, LoggerMiddleware } from "./middlewares";
import { guards } from "./guards";
import { DevtoolsModule } from "@nestjs/devtools-integration";

@Module({
    controllers: [AppController],
    imports: [
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
        SentryModule.forRoot(),
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
                extra: {
                    connectionLimit: configService.get("DB_CONNECTION_LIMIT", 10),
                    
                    // MySQL2 supported keep-alive options
                    keepAliveInitialDelay: configService.get("DB_KEEP_ALIVE_INITIAL_DELAY", 0),
                    enableKeepAlive: configService.get("DB_ENABLE_KEEP_ALIVE", "true") === "true",
                    
                    // Connection idle timeout (in milliseconds) - this controls connection pool idle timeout
                    idleTimeout: configService.get("DB_IDLE_TIMEOUT", 28800000),
                },

                // Connection timeout settings (supported by TypeORM)
                connectTimeout: configService.get("DB_CONNECT_TIMEOUT", 30000),

                // Enable query timeout
                enableQueryTimeout: configService.get("DB_ENABLE_QUERY_TIMEOUT", "true") === "true",

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
        DevtoolsModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                http: configService.get("NODE_ENV") !== "production",
            }),
            inject: [ConfigService],
        }),
        AccessModule,
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
                FormatResponseMiddleware,
                LoggerMiddleware,
            )
            .forRoutes("*");
    }
}
