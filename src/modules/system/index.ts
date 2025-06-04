import { Module } from "@nestjs/common";
import { CustomLogger } from "./logger";

export const systemModules = [];

@Module({
    // imports: [RouterModule],
    providers: [CustomLogger],
    exports: [CustomLogger],
})
export class SystemModule {}

export * from "./configs";
export * from "../../utils/guards";
export * from "./logger";
export * from "../../utils/middlewares";
