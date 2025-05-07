import { RolesSchema } from "src/typing/schemas";
import { z } from "zod";

export type Roles = z.infer<typeof RolesSchema>;
