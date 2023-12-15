import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from '@/mail.service';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService, {
        provide: MailerService,
        useValue: {
          sendMail: jest.fn()
        }
      }],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('메일을 보낸다', async () => {
    jest.spyOn(service, 'sendEmail').mockImplementation(async () => true)
    expect(await service.sendEmail()).toBe(true);
  })
});
