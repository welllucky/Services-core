import { Request } from "express";
import { IUser } from "./User";


export interface UserWithSession
    extends Pick<
        IUser,
        "register"
        | "email"
        | "name"
        | "position"
        | "sector"
        | "role"
        | "isBanned"
        | "canCreateTicket"
        | "canResolveTicket"
    > {
    id: string;
    sessionId: string;
}


export interface RequestWithUser extends Request {
    user: UserWithSession;
}
