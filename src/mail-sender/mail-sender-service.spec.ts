import { Test, TestingModule } from '@nestjs/testing';
import { RegisterMailSenderService } from './register-mail-sender.service';

describe('MailsenderserviceService', () => {
  let service: RegisterMailSenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegisterMailSenderService],
    }).compile();

    service = module.get<RegisterMailSenderService>(RegisterMailSenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
