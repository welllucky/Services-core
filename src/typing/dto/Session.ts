import { ISession } from "../interfaces";

export type SessionDTo = Pick<
  ISession,
  "expiresAt" | "isActive" | "token" | "userId"
>;
