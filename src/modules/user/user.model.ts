import { User } from "@/entities";
import { IRegisterUser } from "@/typing";
import { comparePassword, getUserDataByToken } from "@/utils";
import { Injectable } from "@nestjs/common";
import assert from "node:assert";
import { UserRepository } from "./user.repository";

interface UserModelConstructorModel {
    register?: string;
    email?: string;
    accessToken?: string;
}

@Injectable()
class UserModel {
    private user: User | null;

    constructor(private readonly repository: UserRepository) {
        this.user = new User();
    }

    async init({ register, email, accessToken }: UserModelConstructorModel) {
        try {
            this.user = null;

            let data = null;

            if (register) {
                data = await this.repository.findByRegister(register);
            } else if (email) {
                data = await this.repository.findByEmail(email);
            } else if (accessToken) {
                const userByToken = await getUserDataByToken(accessToken);
                const outsideData = userByToken.userData;

                data = await this.repository.findByRegister(
                    outsideData.register,
                );

                assert.deepStrictEqual(
                    {
                        register: data?.register,
                        email: data?.email,
                        name: data?.name,
                        isBanned: data?.isBanned,
                        canCreateTicket: data?.canCreateTicket,
                        canResolveTicket: data?.canResolveTicket,
                        position: data?.position.name,
                        sector: data?.sector.name,
                        role: data?.role,
                    },
                    {
                        register: outsideData.register,
                        email: outsideData.email,
                        name: outsideData.name,
                        isBanned: outsideData.isBanned,
                        canCreateTicket: outsideData.canCreateTicket,
                        canResolveTicket: outsideData.canResolveTicket,
                        position: outsideData.position,
                        sector: outsideData.sector,
                        role: outsideData.role,
                    },
                );
            } else {
                throw new Error(
                    "Please provide a register, email or access token",
                );
            }

            if (!data) {
                throw new Error("User not found");
            }

            this.user = data;
        } catch {
            return null;
        }
    }

    exists() {
        return this.user !== null;
    }

    getData() {
        return this.user;
    }

    getEntity() {
        if (this.user) return this.user;

        return null;
    }

    getFullName() {
        return this.user?.name;
        // return `${this.user.firstName} ${this.user.lastName}`;
    }

    getRole() {
        return this.user?.role;
    }

    getPosition() {
        return this.user?.position;
    }

    isBanned() {
        return this.user?.isBanned;
    }

    canCreateTicket() {
        return this.user?.canCreateTicket;
    }

    canResolveTicket() {
        return this.user?.canResolveTicket;
    }

    getEmail() {
        return this.user?.email;
    }

    getRegister() {
        return this.user?.register;
    }

    getId() {
        return this.user?.id;
    }

    // getLastConnection() {
    //   return this.user?.lastConnection;
    // }

    // getConnectedTime() {
    //   if (this.user?.lastConnection) {
    //     return new Date(
    //       new Date().getTime() - this.user.lastConnection.getTime(),
    //     ).getHours();
    //   }

    //   return 0;
    // }

    getSectors() {
        return this.user?.sector;
    }

    authUser(password: string) {
        return comparePassword(password, this.user?.hash);
    }

    async createUser(data: IRegisterUser) {
        const user = await this.repository.create(
            {
                register: data.register,
                email: data.email,
                name: data.name,
                position: data.position,
                sector: data.sector,
            },
            data.password,
        );

        this.user = user;

        return { user };
    }
}

export { UserModel };
