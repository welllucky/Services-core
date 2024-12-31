import { z } from "zod";

export const SystemRolesSchema = z.enum([
  "admin",
  "user",
  "manager",
  "guest",
  "viewer",
]);
