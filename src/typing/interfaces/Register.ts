import { z } from "zod";
import { RegisterUserSchema } from "../schemas";

export type IRegisterUser = z.infer<typeof RegisterUserSchema>;
