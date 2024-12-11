import { UserSchema } from "src/typing/schemas";
import { z } from "zod";

export type IUser = z.infer<typeof UserSchema>;
