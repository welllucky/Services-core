import { LocalAuthGuard } from "@/guards";
import { RequestWithUser } from "@/typing";
import { IsPublic } from "@/utils";
import {
    Controller,
    Get,
    HttpCode,
    NotImplementedException,
    Post,
    Request,
    UseGuards,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";

@ApiTags("Authentication")
@Controller("auth")
class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    @IsPublic()
    @UseGuards(LocalAuthGuard)
    @ApiOperation({ summary: "User login" })
    @ApiBody({
        description: "User credentials",
        schema: {
            type: "object",
            properties: {
                email: { type: "string", example: "user@example.com" },
                password: { type: "string", example: "password123" },
            },
            required: ["email", "password"],
        },
    })
    @ApiResponse({
        status: 200,
        description: "Login successful",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "Login successful" },
                data: {
                    type: "object",
                    properties: {
                        accessToken: { type: "string" },
                        user: {
                            type: "object",
                            properties: {
                                register: { type: "string" },
                                name: { type: "string" },
                                email: { type: "string" },
                                role: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiResponse({ status: 401, description: "Invalid credentials" })
    async login(@Request() req: RequestWithUser) {
        return this.authService.login(req.user);
    }

    @Post("refresh")
    @HttpCode(501)
    @ApiOperation({ summary: "Refresh access token" })
    @ApiResponse({ status: 501, description: "Not implemented yet" })
    async refresh() {
        throw new NotImplementedException();
    }

    @Post("logout")
    @ApiOperation({ summary: "User logout" })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: "Logout successful",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "Logout successful" },
            },
        },
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    async logout(@Request() req: RequestWithUser) {
        return this.authService.logout(req.user.register);
    }

    @Get("profile")
    @ApiOperation({ summary: "Get user profile" })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: "User profile retrieved successfully",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Profile retrieved successfully",
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
    @ApiResponse({ status: 401, description: "Unauthorized" })
    async profile(@Request() req: RequestWithUser) {
        return this.authService.getProfile(req.user);
    }
}

export { AuthController };
