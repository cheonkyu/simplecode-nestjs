import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { Mail } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService
  ) {}

  async sendEmail({ email, userId }: { email: string, userId: number }): Promise<boolean> {
    const code = '123456'
    const title = '가입인사'
    const content = `
      <h1>Hello World</h1>
      <b>${code}</b>
    `
    // const result = await this.mailerService
    //   .sendMail({
    //     from: 'cheon9407@gmail.com',
    //     to: email,
    //     subject: title,
    //     html: content,
    //   })
    //   .catch(() => { throw new Error('메일 전송을 실패했습니다.') })
    await this.prisma.mail
      .create({
        data: {
          userId,
          to: email, 
          title,
          content: content,
          code
        }
      })
      .catch(() => { throw new Error('회원가입을 다시 해주세요.') })
    return true
  }

  async verifyEmail({ code }: { code: string }): Promise<Mail> {
    return await this.prisma.mail.findFirstOrThrow({
      where: {
        code
      }
    })
  }
}