import { sign } from "jsonwebtoken";

export const createAccessToken = (
  data: string | object,
  secret: string,
  expiresIn: number,
) => {
  const token = sign(data, secret, {
    algorithm: "HS256",
    expiresIn: `${expiresIn}d`,
  }) as string;

  return token;
};
