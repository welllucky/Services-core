import { User } from "@/entities";
import { IRegisterUser } from "@/typing";
import { comparePassword } from "@/utils";
import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";

interface UserModelConstructorModel {
  register?: string;
  email?: string;
}

@Injectable()
class UserModel {
  private user: User | null;

  constructor(private readonly repository: UserRepository) {
    this.user = new User();
  }

  async init({ register, email }: UserModelConstructorModel) {
    this.user = null;
    const userByRegister = register
      ? await this.repository.findByRegister(register)
      : null;

    const userByEmail = email ? await this.repository.findByEmail(email) : null;

    if (!userByEmail && !userByRegister) {
      throw new Error("Usuário não encontrado");
    }

    this.user = register ? userByRegister : userByEmail;

    console.log({ actual: register ? userByRegister : userByEmail });
  }

  exists({ safe = false }: { safe?: boolean }) {
    if (!this.user) {
      if (!safe) throw new Error("Usuário não encontrado");
      return false;
    }

    return true;
  }

  getData() {
    return this.user;
  }

  getEntity() {
    if (this.user) return this.user;
    throw new Error("Não existe entidade para o usuário");
  }

  getFullName() {
    return this.user?.name;
    // return `${this.user.firstName} ${this.user.lastName}`;
  }

  getRole() {
    return this.user?.role;
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

  getLastConnection() {
    return this.user?.lastConnection;
  }

  getConnectedTime() {
    if (this.user?.lastConnection) {
      return new Date(
        new Date().getTime() - this.user.lastConnection.getTime(),
      ).getHours();
    }

    return 0;
  }

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
        role: data.role,
        systemRole: data.systemRole,
        sector: data.sector,
      },
      data.password,
    );

    this.user = user;

    return { user };
  }
}

export { UserModel };
