import { z } from "zod";
import { EventSchema } from "./Evet";
import { PriorityLevelsSchema } from "./PriorityLevel";

export const TicketTypeSchema = z.enum([
  "task",
  "incident",
  "problem",
  "change",
]);

export const TicketStatusSchema = z.enum([
  "notStarted",
  "inProgress",
  "blocked",
  "closed",
]);

export const TicketSchema = z.object({
  id: z.string(),
  resume: z.string(),
  description: z.string(),
  date: z.string().or(z.date()),
  historic: z.array(EventSchema).nullish(),
  priority: PriorityLevelsSchema,
  type: TicketTypeSchema,
  status: TicketStatusSchema,
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  closedAt: z.string().or(z.date()).nullable(),
  createdBy: z.string(),
  updatedBy: z.string(),
  closedBy: z.string().nullable(),
});
