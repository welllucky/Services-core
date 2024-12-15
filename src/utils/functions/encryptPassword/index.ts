import { genSaltSync, hashSync } from "bcrypt";

export const encryptPassword = (password: string) => {
  const salt = genSaltSync(10);
  const hashedPassword = hashSync(password, salt);

  return { hashedPassword, salt };
};
