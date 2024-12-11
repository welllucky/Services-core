import { z } from "zod";

export const EventSchema = z.object({
  id: z.string(),
  order: z.number(),
  emitterId: z.string(),
  createdBy: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(["open", "close", "reopen", "message", "system"]),
  visibility: z.enum(["public", "private"]),
  date: z.string().or(z.date()),
  icon: z.string().optional(),
});
