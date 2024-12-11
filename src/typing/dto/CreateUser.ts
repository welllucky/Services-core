import { z } from "zod";
import { CreateUserSchema } from "../schemas";

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
