import { IUser } from "@/typing";
import jwt from "jsonwebtoken";

export const getUserByToken = async (token: string) => {
  const accessToken = token?.replace("Bearer ", "");

  if (!accessToken) {
    throw new Error("No access token found");
  }

  const userData = jwt.verify(accessToken, process.env.AUTH_SECRET ?? "", {
    algorithms: ["HS256"],
  }) as unknown as IUser;

  return { userData, accessToken };
};
