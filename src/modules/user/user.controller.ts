import { CreateUserDTO, UpdateUserDTO } from "@/typing";
import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  getAll(@Query("page") page: number, @Query("index") index: number) {
    return this.service.findAll({ page, index });
  }

  @Get(":register")
  getUserByRegister(@Param("register") register: string) {
    return this.service.findOne(register);
  }

  @Get("/email/:email")
  getUserByEmail(@Param("email") email: string) {
    return this.service.findByEmail(email);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDTO) {
    return this.service.create(createUserDto);
  }

  @Put(":register")
  update(
    @Param("register") register: string,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    this.service.update(register, updateUserDto);
  }

  // @Delete(":register")
  // remove(@Param("register") register: string) {
  //   this.service.remove(register);
  // }
}
