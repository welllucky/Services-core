import { User } from "@/entities";
import { UserRepository } from "@/repositories/user.repository";
import { IRegisterUser } from "@/typing";
import { comparePassword, getUserDataByToken } from "@/utils";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { RoleModel } from "./role.model";

interface UserModelConstructorModel {
    register?: string;
    email?: string;
    accessToken?: string;
}

@Injectable()
class UserModel {
    private user: User | null;
    private role!: RoleModel | null;

    constructor(
        private readonly repository: UserRepository,
        // private readonly data?: UserModelConstructorModel,
    ) {
        this.user = new User();
    }

    async init({
        register,
        email,
        accessToken,
    }: UserModelConstructorModel) {
            this.user = null;

            let data: User | null = null;

            if (!register && !email && !accessToken) {
                throw new BadRequestException(
                    "Please sign in on the app to continue",
                );
            }

            if (register) {
                data = await this.repository.findByRegister(register);
            }

            if (email) {
                data = await this.repository.findByEmail(email);
            }

            if (accessToken) {
                const userByToken = getUserDataByToken(accessToken);

                const outsideData = userByToken.userData;

                data = await this.repository.findByRegister(
                    outsideData?.register || "",
                );
            }

            if (!data) {
                throw new NotFoundException("User not found");
            }

            this.user = data;
            this.role = new RoleModel(data.role);
            return this.user;
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

    FullName() {
        return this.user?.name;
        // return `${this.user.firstName} ${this.user.lastName}`;
    }

    Role() {
        return this.role;
    }

    Position() {
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

    Email() {
        return this.user?.email;
    }

    Register() {
        return this.user?.register;
    }

    Id() {
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

    getSector() {
        return this.user?.sector;
    }

    authUser(password: string) {
        return comparePassword(password, this.user?.hash || "");
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
