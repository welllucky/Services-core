import { IUser } from "@/typing";
import { verify } from "jsonwebtoken";

export const getUserByToken = async (token: string) => {
  const accessToken = token?.replace("Bearer", "").trimStart().trimEnd();

  if (!accessToken) {
    return { userData: null, accessToken: null };
  }

  const userData = verify(accessToken, process.env.AUTH_SECRET ?? "", {
    algorithms: ["HS256"],
  }) as unknown as IUser;

  return { userData, accessToken };
};
