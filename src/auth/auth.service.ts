import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService, PrismaException, PRISMA_ERROR } from '@/prisma/prisma.service';
import { Mail, Prisma, UserStatus } from '@prisma/client';
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
            .catch(
                PrismaException({
                    [PRISMA_ERROR.P2002]: '계정정보를 확인해주세요.'
                })
            )
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
            .catch(
                PrismaException({
                    [PRISMA_ERROR.P2002]: '계정정보를 확인해주세요.'
                })
            )
        return result
    }

    async login({ email }: Login) {
        const result = await this.prisma.user
            .findFirstOrThrow({
                where: {
                    email
                }
            })
            .catch(
                PrismaException({
                    [PRISMA_ERROR.P2025]: '계정 및 비밀번호를 확인해주세요.'
                })
            )
        if(result.status === UserStatus.Ready) {
            throw new ConflictException('이메일 가입 절차를 확인해주세요.') 
        }
        return {
            access_token: await this.jwtService.signAsync(result),
        }
    }
}
