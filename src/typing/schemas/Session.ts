import { z } from "zod";

export const ISessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  token: z.string(),
  isActive: z.boolean(),
  expiresAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const SessionResponseSchema = z.object({
  accessToken: z.string(),
  expiresAt: z.date(),
});
