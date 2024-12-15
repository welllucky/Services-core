import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
// import { genSalt, hash } from "bcrypt";
import { User } from "src/entities";
import { Repository } from "typeorm";
import { CreateUserDTO, UpdateUserDTO } from "./dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    try {
      return await this.userRepository.findOneBy({ register: id });
    } catch (error) {
      console.error("Error finding user:", error);
      throw new Error("Could not find user");
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Could not delete user");
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOneBy({ email });
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Could not find user by email");
    }
  }

  async create(data: CreateUserDTO): Promise<User | null> {
    const newUser = this.userRepository.create(data);
    try {
      await this.userRepository.save(newUser, {
        data: {
          rootPassword: data.password,
        },
      });

      return newUser;
    } catch (error) {
      console.error("Error saving new user:", error);
      throw new Error("Could not save new user");
    }
  }

  async update(id: string, data: UpdateUserDTO) {
    try {
      return await this.userRepository.update({ register: id }, data);
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Could not update user");
    }
  }
}
