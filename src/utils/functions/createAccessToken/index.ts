import { sign } from "jsonwebtoken";

export const createAccessToken = (
    data: string | object,
    secret: string,
    expiresIn: number,
) => {
    const token = sign(data, secret, {
        algorithm: "HS256",
        expiresIn: `${expiresIn}d`,
        issuer: process.env.CLIENT_URL ?? "services",
        header: {
            typ: "JWT",
            alg: "HS256",
        },
    });

    return token;
};
