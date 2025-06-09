import { Module } from "@nestjs/common";
import { CustomLogger } from "./logger";

export const systemModules = [];

@Module({
    // imports: [RouterModule],
    providers: [CustomLogger],
    exports: [CustomLogger],
})
export class SystemModule {}

export * from "../../guards";
export * from "../../middlewares";
export * from "./configs";
export * from "./logger";
