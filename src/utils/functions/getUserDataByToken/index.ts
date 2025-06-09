import { IUser } from "@/typing";
import { verify } from "jsonwebtoken";

interface IAuthenticationUserData {
    userData: IUser | null;
    accessToken: string | null;
}

export const getUserDataByToken = (token: string): IAuthenticationUserData => {
    try {
        const accessToken = token?.replace("Bearer", "").trimStart().trimEnd();
        const authToken = process.env.AUTH_SECRET ?? "";

        if (!accessToken) {
            return { userData: null, accessToken: null };
        }

        const userData = verify(accessToken, authToken, {
            algorithms: ["HS256"],
        }) as unknown as IUser;

        return { userData, accessToken };
    } catch {
        return { userData: null, accessToken: null };
    }
};
