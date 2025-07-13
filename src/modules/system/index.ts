import { Module } from "@nestjs/common";
import { CustomLogger } from "./logger";

export const systemModules = [
    CustomLogger,
];

@Module({
    providers: [...systemModules],
    exports: [...systemModules],
})
export class SystemModule {}

export * from "./configs";
export * from "./logger";
