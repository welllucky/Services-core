import { z } from "zod";

export const RolesSchema = z.enum([
    "admin",
    "user",
    "manager",
    "guest",
    "viewer",
]);
