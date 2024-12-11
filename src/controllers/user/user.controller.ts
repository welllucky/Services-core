import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  Put,
} from "@nestjs/common";

import { UserService } from "src/services";

import { CreateUserDto, UpdateUser } from "src/typing";

@Controller("users")
@Injectable()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.findAll();
  }

  @Get(":register")
  getUserByRegister(@Param("register") register: string) {
    return this.userService.findOne(register);
  }

  @Get("/email/:email")
  getUserByEmail(@Param("email") email: string) {
    return this.userService.findByEmail(email);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.userService.create(createUserDto);
  }

  @Put(":register")
  update(
    @Param("register") register: string,

    @Body() updateUserDto: UpdateUser,
  ) {
    this.userService.update(register, updateUserDto);
  }

  @Delete(":register")
  remove(@Param("register") register: string) {
    this.userService.remove(register);
  }
}
