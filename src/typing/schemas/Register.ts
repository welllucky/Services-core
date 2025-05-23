import { z } from "zod";
import { RolesSchema } from "./SystemRoles";

export const RegisterUserSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    register: z.string().min(3).max(10),
    name: z.string().min(5).max(80),
    password: z.string().min(8),
    position: z.string(),
    role: RolesSchema,
    sector: z.string(),
});
