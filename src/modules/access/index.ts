import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { AccountModule } from "./account/account.module";


export const accessModules = [
    AuthModule,
    AccountModule,
];

@Module({
    imports: [...accessModules],
    exports: [...accessModules],
})
export class AccessModule {}
