import { z } from "zod";

export const PriorityLevelsSchema = z.enum(["low", "medium", "high"]);
