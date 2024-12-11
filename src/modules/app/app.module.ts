import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "src/controllers";
import { AppService } from "src/services";
import { modules } from "..";
import { configLoads } from "./configs";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        ".env.local",
        ".env.development",
        ".env.production",
        ".env",
      ],
      isGlobal: true,
      cache: true,
      load: configLoads,
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
        synchronize: true,
        entities: ["@/entities/*.entity.ts"],
        ssl: {
          ca: configService.get("DB_CA"),
        },
      }),
      inject: [ConfigService],
    }),
    ...modules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
