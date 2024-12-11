import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
} from "@nestjs/common";
import { UserService } from "src/services";
import { CreateUserDto } from "src/typing";

@Controller("user")
@Injectable()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.findAll();
  }

  @Get(":email")
  getUserByEmail(@Param("email") email: string) {
    return this.userService.findByEmail(email);
  }

  @Get(":register")
  getUserByRegister(@Param("register") register: string) {
    return this.userService.findOne(register);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.userService.create(createUserDto);
  }

  @Delete(":register")
  remove(@Param("register") register: string) {
    this.userService.remove(register);
  }
}
