import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@/auth/auth.service';
import { UserStatus } from '@prisma/client';
import { PrismaModule } from '@/prisma/prisma.module';
import { MailModule } from '@/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MailModule, 
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60s' },
        }),
        PrismaModule,
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('회원가입', async () => {
    expect(service).toBeDefined();
    const created = {
      id: 1,
      uuid: '123',
      email: 'my@simplecode.co.kr',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: UserStatus.Ready,
      deleted: false
    }
    jest.spyOn(service, 'createAccount').mockImplementation(async () => created)
    expect(await service.createAccount({ email :  'my@simplecode.co.kr' })).toBe(created);
  });

  // it('동일한 계정으로 가입은 안된다.', async () => {
  //   expect(service).toBeDefined();
  //   jest.spyOn(service, 'createAccount').mockImplementation(async () => { throw new Error('회원가입을 다시 해주세요.') })
  //   expect(service.createAccount({ email : 'my@simplecode.co.kr' })).rejects.toThrowError(
  //     new Error('회원가입을 다시 해주세요.')
  //   );
  // });
});
