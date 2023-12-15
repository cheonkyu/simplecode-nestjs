import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Mail, UserStatus } from '@prisma/client';
import { CreateAccount, Login } from '@/auth/dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async createAccount({ email }: CreateAccount) {
        const result = await this.prisma.user
            .create({
                data: {
                email,
                status: UserStatus.Ready
                }
            })
            .catch(() => { throw new Error('회원가입을 다시 해주세요.') })
        return result
    }

    async verifyEmail(mail: Mail) {
        const { userId } = mail
        const result = await this.prisma.user
            .update({
                where: {
                id: userId
                },
                data: {
                    status: UserStatus.Ok
                }
            })
            .catch(() => { throw new Error('회원가입을 다시 해주세요.') })
        return result
    }

    async login({ email }: Login) {
        const result = await this.prisma.user
            .findFirstOrThrow({
                where: {
                email
                }
            })
            .catch(() => { throw new Error('계정 및 비밀번호를 확인해주세요.') })
        if(result.status === UserStatus.Ready) {
            throw new Error('이메일 가입 절차를 확인해주세요.') 
        }
        return {
            access_token: await this.jwtService.signAsync(result),
        }
    }
}
