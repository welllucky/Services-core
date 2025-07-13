import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";


export const accessModules = [
    AuthModule,
];

@Module({
    imports: [...accessModules],
    exports: [...accessModules],
})
export class AccessModule {}
