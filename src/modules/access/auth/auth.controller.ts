import { LocalAuthGuard } from "@/guards";
import { RequestWithUser } from "@/typing";
import { IsPublic } from "@/utils";
import { Controller, Get, HttpCode, NotImplementedException, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";

@ApiTags('Authentication')
@Controller('auth')
class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'User login' })
    @ApiBody({
        description: 'User credentials',
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@example.com' },
                password: { type: 'string', example: 'password123' }
            },
            required: ['email', 'password']
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Login successful' },
                data: {
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string' },
                        user: {
                            type: 'object',
                            properties: {
                                register: { type: 'string' },
                                name: { type: 'string' },
                                email: { type: 'string' },
                                role: { type: 'string' }
                            }
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @IsPublic()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: RequestWithUser) {
        return this.authService.login(req.user);
    }

    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 501, description: 'Not implemented yet' })
    @Post('refresh')
    @HttpCode(501)
    async refresh() {
       throw new NotImplementedException();
    }

    @ApiOperation({ summary: 'User logout' })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Logout successful',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Logout successful' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Post('logout')
    async logout(@Request() req: RequestWithUser) {
        return this.authService.logout(req.user.register);
    }

    @ApiOperation({ summary: 'Get user profile' })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'User profile retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Profile retrieved successfully' },
                data: {
                    type: 'object',
                    properties: {
                        register: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string' },
                        position: { type: 'string' },
                        sector: { type: 'string' }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Get('profile')
    async profile(@Request() req: RequestWithUser) {
        return this.authService.getProfile(req.user);
    }
}

export { AuthController };
