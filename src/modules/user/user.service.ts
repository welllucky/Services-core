import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities";
import { CreateUserDto } from "src/typing";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ register: id });
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  create(data: CreateUserDto) {
    return this.userRepository.create(data);
  }

  update(id: string, data: CreateUserDto) {
    return this.userRepository.update(
      {
        register: id,
      },
      data,
    );
  }
}
