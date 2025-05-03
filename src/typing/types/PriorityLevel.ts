import { PriorityLevelsSchema } from "src/typing/schemas/PriorityLevel";
import { z } from "zod";

export type PriorityLevels = z.infer<typeof PriorityLevelsSchema>;
