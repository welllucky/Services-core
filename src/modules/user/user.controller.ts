import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { CreateUserDTO, UpdateUserDTO } from "./dto";
import { UserService } from "./user.service";

@Controller("users")
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
  create(@Body() createUserDto: CreateUserDTO) {
    return this.userService.create(createUserDto);
  }

  @Put(":register")
  update(
    @Param("register") register: string,

    @Body() updateUserDto: UpdateUserDTO,
  ) {
    this.userService.update(register, updateUserDto);
  }

  // @Delete(":register")
  // remove(@Param("register") register: string) {
  //   this.userService.remove(register);
  // }
}
