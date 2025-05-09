import { IUser } from "@/typing";
import { searchUserByRegister } from "../searchUserByRegister";

export const validUserData = async (outsideUserData: IUser) => {
    const userData = await searchUserByRegister(outsideUserData?.register);

    return (
        outsideUserData?.register === userData?.register &&
        outsideUserData?.isBanned === userData?.isBanned &&
        outsideUserData?.email === userData?.email &&
        // outsideUserData?.role === userData?.role &&
        outsideUserData?.name === userData?.name &&
        outsideUserData?.canCreateTicket === userData?.canCreateTicket &&
        outsideUserData?.canResolveTicket === userData?.canResolveTicket &&
        outsideUserData?.position === userData?.position &&
        outsideUserData?.sector === userData?.sector
    );
};
