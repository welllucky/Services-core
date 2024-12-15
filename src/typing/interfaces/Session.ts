import { z } from "zod";
import { ISessionSchema } from "../schemas";

export type ISession = z.infer<typeof ISessionSchema>;

export type ISessionResponse = {
  accessToken: string,
  expiresAt: Date,
};
