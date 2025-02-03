import { EventSchema } from "src/typing/schemas/Evet";
import { z } from "zod";

export type IEvent = z.infer<typeof EventSchema>;
