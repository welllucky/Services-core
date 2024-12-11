import { IUser } from "../interfaces";

export type UpdateUser = Omit<IUser, "register" | "lastConnection">;
