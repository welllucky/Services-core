import { CreateUserDTO, UpdateUserDTO } from "@/typing";
import { AllowRoles, IsPublic } from "@/utils/decorators";
import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { UserService } from "@/modules/shared/user";

@Controller("users")
export class UserController {
    constructor(private readonly service: UserService) {}

    @Get()
    @AllowRoles(["admin", "manager"])
    getAll() {
        return this.service.findAll();
    }

    @Get(":register")
    @AllowRoles(["admin", "manager"])
    getUserByRegister(@Param("register") register: string) {
        return this.service.findOne(register);
    }

    @Get("/email/:email")
    @AllowRoles(["admin", "manager"])
    getUserByEmail(@Param("email") email: string) {
        return this.service.findByEmail(email);
    }

    @IsPublic()
    @Throttle({ default: { limit: 1, ttl: 60000 } })
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
