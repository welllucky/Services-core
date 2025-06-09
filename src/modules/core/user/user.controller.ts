import { CreateUserDTO } from "@/typing";
import { AllowRoles, IsPublic } from "@/utils/decorators";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
    constructor(private readonly service: UserService) {}

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
}
