import { IUser } from "@/typing";
import { verify } from "jsonwebtoken";

export const getUserByToken = async (token: string) => {
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
