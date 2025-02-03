import { TicketSchema } from "src/typing/schemas/Ticket";
import { z } from "zod";

export type ITicket = z.infer<typeof TicketSchema>;
