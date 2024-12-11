import { RegisterUserSchema } from "src/typing/schemas";
import { z } from "zod";

export type IRegisterUser = z.infer<typeof RegisterUserSchema>;
