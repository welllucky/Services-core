import { User } from "@/database/entities";

export const searchUserByRegister = async (register: string) => {
    const userData = await User.findOneByOrFail({
        register,
    });

    return {
        ...userData,
        position: userData?.position?.name,
        sector: userData?.sector?.name,
    };
};
