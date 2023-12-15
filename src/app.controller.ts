import { Controller, Get } from '@nestjs/common';
import { AppService } from '@/app.service';
import { MailService } from '@/mail/mail.service';
import { Mail } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailService: MailService
  ) {}

  @Get('test')
  async getHello1(): Promise<Mail[]> {
    return []
  }

}
