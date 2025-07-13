import { LocalAuthGuard } from "@/guards";
import { RequestWithUser } from "@/typing";
import { IsPublic } from "@/utils";
import { Controller, Get, HttpCode, NotImplementedException, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
class AuthController {
    constructor(private readonly authService: AuthService) {}

    @IsPublic()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: RequestWithUser) {
        return this.authService.login(req.user);
    }

    @Post('refresh')
    @HttpCode(501)
    async refresh() {
       throw new NotImplementedException();
    }

    @Post('logout')
    async logout(@Request() req: RequestWithUser) {
        return this.authService.logout(req.user.register);
    }

    @Get('profile')
    async profile(@Request() req: RequestWithUser) {
        return this.authService.getProfile(req.user);
    }
}

export { AuthController };
