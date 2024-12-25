import {
  CreateUserDTO,
  IResponseFormat,
  UpdateUserDTO,
  UserPublicDTO,
  UserRestrictDTO,
} from "@/typing";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<IResponseFormat<UserPublicDTO[]>> {
    try {
      const users = await this.userRepository.findAll();

      if (users) {
        return {
          title: "Users was found",
          message: "All users actives in the system",
          data: users.map(
            (user) =>
              new UserPublicDTO(
                user.name,
                user.email,
                user.role,
                user.sector,
                user.canCreateTicket,
                user.canResolveTicket,
                user.isBanned,
                user.register,
              ),
          ),
        };
      } else {
        throw new HttpException(
          {
            title: "Users not found",
            message: "No users actives in the system",
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      console.error("Error finding users:", error);
      throw new HttpException(
        "Could not find users",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(register: string) {
    try {
      const user = await this.userRepository.findByRegister(register);
      if (user) {
        return user;
      } else {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      console.error("Error finding user:", error);
      throw new HttpException(
        "Could not find user",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (user) {
        return user;
      } else {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new HttpException(
        "Could not find user by email",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(data: CreateUserDTO): Promise<IResponseFormat<UserRestrictDTO>> {
    try {
      const createdUser = await this.userRepository.create(data, data.password);

      if (createdUser) {
        return {
          title: "User created",
          message: "User was created successfully",
          data: new UserRestrictDTO(
            createdUser.name,
            createdUser.email,
            createdUser.role,
            createdUser.sector,
            createdUser.isBanned,
            createdUser.canCreateTicket,
            createdUser.canResolveTicket,
            createdUser.systemRole,
            createdUser.register,
          ),
        };
      } else {
        throw new HttpException(
          {
            title: "User not created",
            message: "User was not created, please try again later",
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.error("Error saving new user:", error);
      throw new HttpException(
        "Could not save new user",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, data: UpdateUserDTO) {
    try {
      await this.userRepository.update(id, data);
      return {
        message: "User updated successfully",
      };
    } catch (error) {
      console.error("Error updating user:", error);
      throw new HttpException(
        "Could not update user",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
