import { z } from "zod";
import { SystemRolesSchema } from "./SystemRoles";
import { RegisterUserSchema } from "./Register";

export const UserSchema = z.object({
  register: z.string().min(3).max(10),
  name: z.string().min(5).max(80),
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  lastConnection: z.date().nullish(),
  isBanned: z.boolean().default(false),
  canCreateTicket: z.boolean().default(true),
  canResolveTicket: z.boolean().default(true),
  role: z.string(),
  sector: z.string(),
  systemRole: SystemRolesSchema,
});

export const UserTableSchema = z.object({
  id: z.string(),
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  register: z.string().min(3).max(10),
  name: z.string().min(5).max(80),
  role: z.string(),
  sector: z.string(),
  lastConnection: z.date().nullish(),
  isBanned: z.boolean().default(false),
  canCreateTicket: z.boolean().default(true),
  canResolveTicket: z.boolean().default(true),
  hash: z.string(),
  salt: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
});

export const CreateUserSchema = z.union([RegisterUserSchema, UserSchema]);
