import { z } from "zod";
import { UserTableSchema } from "../schemas";

export type UserTableDto = z.infer<typeof UserTableSchema>;
