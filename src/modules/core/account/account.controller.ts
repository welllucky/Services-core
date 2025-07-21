import { AccountService } from "@/modules/shared";
import { CreateUserDTO } from "@/typing";
import { IsPublic } from "@/utils";
import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";

@ApiTags('Account Management')
@Controller("account")
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Post("create")
    @IsPublic()
    @ApiOperation({ summary: "Create new account" })
    @ApiBody({
        description: "Account creation data",
        schema: {
            type: "object",
            properties: {
                register: { type: "string", example: "123456" },
                name: { type: "string", example: "John Doe" },
                email: { type: "string", example: "john@example.com" },
                password: { type: "string", example: "securePassword123" },
                position: { type: "string", example: "Developer" },
                sector: { type: "string", example: "IT" },
            },
            required: [
                "register",
                "name",
                "email",
                "password",
                "position",
                "sector",
            ],
        },
    })
    @ApiResponse({
        status: 201,
        description: "User created successfully",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "User created successfully",
                },
                data: {
                    type: "object",
                    properties: {
                        register: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        role: { type: "string" },
                        position: { type: "string" },
                        sector: { type: "string" },
                    },
                },
            },
        },
    })
    @ApiResponse({ status: 400, description: "Bad Request - Invalid data" })
    @ApiResponse({ status: 409, description: "Conflict - User already exists" })
    @ApiResponse({
        status: 429,
        description: "Too Many Requests - Rate limit exceeded",
    })
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    async create(@Body() createUserDto: CreateUserDTO) {
        return this.accountService.create(createUserDto);
    }
}
