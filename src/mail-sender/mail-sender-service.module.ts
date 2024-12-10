import { Module } from '@nestjs/common';
import { RegisterMailSenderService } from './register-mail-sender.service';
import { ForgotPasswordMailSenderService } from './forgot-password-mail-sender.service';



@Module({
  controllers: [],
  providers: [
    {
      provide: 'IConfirmationRegisterService',
      useClass: RegisterMailSenderService
    },
    {
      provide: 'IForgotPasswordService',
      useClass: ForgotPasswordMailSenderService
    }
  ],
  exports: [
    'IConfirmationRegisterService',
    'IForgotPasswordService'
  ]
})
export class MailsenderserviceModule {}
