import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MailService } from '@/mail/mail.service';
import { AuthService } from '@/auth/auth.service';
import { CreateAccount, Login, VerifyAccount } from '@/auth/dto';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from './guard/access-token.guard';
import { User } from '@/user.decorator';
import { RefreshTokenGuard } from './guard/refresh-token.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly mailService: MailService
    ) {}
   
    @Post('account')
    async createAccount(@Body() body: CreateAccount) {
        const { id, email } = await this.authService.createAccount(body)
        await this.mailService.sendEmail({ email: body.email, userId: id })
        return { email }
    }

    @Post('account/verify')
    async verifyAccount(@Body() body: VerifyAccount) {
        const mail = await this.mailService.verifyEmail(body)
        const result = await this.authService.verifyEmail(mail)
        return result
    }

    @Post('login')
    async login(@Body() body: Login) {
        const result = await this.authService.login(body)
        return result
    }

    @UseGuards(AccessTokenGuard)
    @Post('logout')
    async logout(@User() user) {
        const { uuid } = user 
        const result = await this.authService.logout(uuid)
        return result
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    async refreshTokens(@Req() req: Request ) {
        console.log(req)
        // const result = await this.authService.refreshTokens(body)
        // return result
    }
}
