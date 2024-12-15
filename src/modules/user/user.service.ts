import { Injectable } from "@nestjs/common";
import { User } from "@/entities";
import { CreateUserDTO, UpdateUserDTO } from "@/typing";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findOne(register: string) {
    try {
      return await this.userRepository.findByRegister(register);
    } catch (error) {
      console.error("Error finding user:", error);
      throw new Error("Could not find user");
    }
  }

  // async remove(id: string): Promise<void> {
  //   try {
  //     await this.userRepository.delete(id);
  //   } catch (error) {
  //     console.error("Error deleting user:", error);
  //     throw new Error("Could not delete user");
  //   }
  // }

  async findByEmail(email: string) {
    try {
      return await this.userRepository.findByEmail(email);
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Could not find user by email");
    }
  }

  async create(data: CreateUserDTO) {
    try {
      return await this.userRepository.create(data, data.password);
    } catch (error) {
      console.error("Error saving new user:", error);
      throw new Error("Could not save new user");
    }
  }

  async update(id: string, data: UpdateUserDTO) {
    try {
      return await this.userRepository.update(id, data);
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Could not update user");
    }
  }
}
