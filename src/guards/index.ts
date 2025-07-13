import { Provider } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth.guard";
import { RoleGuard } from "./role.guard";

const availableGuards = [
    JwtAuthGuard,
    RoleGuard,
];

export const guards: Provider[] = availableGuards.map((guard) => ({
    provide: APP_GUARD,
    useClass: guard,
}));

export * from "./auth.guard";
export * from "./role.guard";
