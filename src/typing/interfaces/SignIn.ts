import { SignInSchema } from "src/typing/schemas";
import { z } from "zod";

export type ISignIn = z.infer<typeof SignInSchema>;
