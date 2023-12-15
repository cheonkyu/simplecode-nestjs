import { User, UserStatus } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async findAll() {
    return []
  }
  
  async findOne(uuid: string) {
    const result = await this.prisma.user
      .findFirstOrThrow({
        where: { uuid }
      })
      .catch(() => { throw new Error('회원정보를 확인해주세요.')})
    return result
  }
  
}
