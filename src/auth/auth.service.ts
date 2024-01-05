import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService, PrismaException, PRISMA_ERROR } from '@/prisma/prisma.service';
import { Mail, Prisma, User, UserStatus } from '@prisma/client';
import { CreateAccount, Login } from '@/auth/dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async createAccount({ email, password }: CreateAccount) {
        const hashed =  await argon2.hash(password)
        const result = await this.prisma.user
            .create({
                data: {
                    email,
                    password: hashed,
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

    async login({ email, password }: Login) {
        const user = await this.prisma.user
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
        if(user.status === UserStatus.Ready) {
            throw new ConflictException('이메일 가입 절차를 확인해주세요.') 
        }
        const isMatch = await argon2.verify(user.password, password);
        if(!isMatch) {
            throw new ConflictException('계정 및 비밀번호를 확인해주세요.') 
        }
        const result = await this.getTokens(user)
        await this.updateRefreshToken({
            id: user.id,
            refreshToken: result.refreshToken
        })
        
        return result
    }

    async getTokens({ id, uuid }: User) {
        const [accessToken, refreshToken] = await Promise.all([
          this.jwtService.signAsync(
            {
                sub: id,
                id,
                uuid
            },
            {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '15m',
            },
          ),
          this.jwtService.signAsync(
            {
                sub: id,
                id,
                uuid
            },
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            },
          ),
        ]);
    
        return {
          accessToken,
          refreshToken,
        };
    }

    async refreshTokens({ id, uuid, refreshToken }: { id: number, uuid: string, refreshToken: string }) {
        const user = await this.prisma.user
            .findFirstOrThrow({
                where: { id, uuid }
            })
            .catch(
                PrismaException({
                    [PRISMA_ERROR.P2025]: 'Access Denied'
                })
            )
        const isMatch = await argon2.verify(
          user.refreshToken,
          refreshToken,
        )
        if(!isMatch) throw new ForbiddenException('Access Denied')
        const result = await this.getTokens(user)
        await this.updateRefreshToken({
            id: user.id,
            refreshToken: result.refreshToken
        })
        return result
      }

    async logout({ id, uuid }: { id: number, uuid : string }) {
        await this.prisma.user.update({
            where: {
                id,
                uuid
            },
            data : {
                refreshToken: null
            }
        })
    }

    async updateRefreshToken({ id, refreshToken }: { id: number, refreshToken: string }) {
        const _refreshToken = await argon2.hash(refreshToken)
        await this.prisma.user.update({
            where: {
                id
            },
            data : {
                refreshToken: _refreshToken
            }
        })
        .catch(
            PrismaException({
                [PRISMA_ERROR.P2025]: '계정 및 비밀번호를 확인해주세요.'
            })
        )
    }
}
