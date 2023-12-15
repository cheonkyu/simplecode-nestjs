import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '@/mail/mail.module';
import { UsersModule } from '@/users/users.module';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthModule } from '@/auth/auth.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot(), MailModule, UsersModule, AuthModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
