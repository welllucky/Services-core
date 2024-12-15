import { SystemRolesSchema } from "src/typing/schemas";
import { z } from "zod";

export type SystemRoles = z.infer<typeof SystemRolesSchema>;
