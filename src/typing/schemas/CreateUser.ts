import { z } from "zod";
import { RegisterUserSchema } from "./Register";
import { UserSchema } from "./User";

export const CreateUserSchema = z.union([RegisterUserSchema, UserSchema]);
