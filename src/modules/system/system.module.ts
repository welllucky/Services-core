import { Module } from "@nestjs/common";
import { CustomLogger } from "./logger/logger.service";

@Module({
    providers: [CustomLogger],
    exports: [CustomLogger],
})
export class SystemModule {}
