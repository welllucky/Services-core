import { compareSync, genSaltSync, hashSync } from "bcryptjs";

export const encryptPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(
        password.trimStart().trimEnd().trim(),
        salt,
    );

    return { hashedPassword, salt };
};

export const comparePassword = async (password: string, hash: string) => {
    const isValid = compareSync(password.trimStart().trimEnd().trim(), hash);

    return { isValid };
};
