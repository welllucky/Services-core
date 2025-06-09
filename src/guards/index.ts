import { Provider } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import { RoleGuard } from "./role.guard";

const availableGuards = [
    AuthGuard,
    RoleGuard,
];

export const guards: Provider[] = availableGuards.map((guard) => ({
    provide: APP_GUARD,
    useClass: guard,
}));
