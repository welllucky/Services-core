import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { RoleModule } from "./role/role.module";

export const backofficeModules = [RoleModule];

@Module({
    imports: [
        ...backofficeModules,
        RouterModule.register(
            backofficeModules.map((module) => ({
                path: "backoffice",
                module,
            })),
        ),
    ],
    exports: [...backofficeModules],
})
export class BackofficeModule {}
