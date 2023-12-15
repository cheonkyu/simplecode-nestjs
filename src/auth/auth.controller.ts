import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from '@/mail/mail.service';
import { AuthService } from '@/auth/auth.service';
import { CreateAccount, Login, VerifyAccount } from '@/auth/dto';
import { ApiTags } from '@nestjs/swagger';

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

    @Post('logout')
    async logout() {
        // const result = await this.usersService.signin(body)
        // return {
        //     access_token: await this.jwtService.signAsync(result),
        // };
    }
}
