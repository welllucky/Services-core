import { User } from "@/entities";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async findByRegister(register: string) {
    return this.repository.findOne({ where: { register } });
  }

  async findByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  async create(
    user: Omit<
      User,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "deletedAt"
      | "lastConnection"
      | "isBanned"
      | "canCreateTicket"
      | "canResolveTicket"
      | "encryptPasswordInDB"
      | "hash"
      | "salt"
      | "sessions"
      | "systemRole"
    >,
    password: string,
  ) {
    return this.repository.save(user, {
      data: {
        rootPassword: password,
      },
    });
  }

  async update(userId: string, user: Partial<User>) {
    return this.repository.update(
      {
        register: userId,
      },
      user,
    );
  }
}
