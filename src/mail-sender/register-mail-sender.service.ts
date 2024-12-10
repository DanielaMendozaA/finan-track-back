import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailConfig } from 'src/common/config/email.config';
import { IConfirmationRegisterService } from './interfaces/confirmation-register-service.interface';
import { verificationRegisterEmailTemplate } from 'src/mail-sender/emails/verification-register.email.template';



@Injectable()
export class RegisterMailSenderService extends MailConfig implements IConfirmationRegisterService{
  constructor(
    private readonly configService: ConfigService
  ) {
    super();  
  }

  async sendVerificationEmail(email: string, name: string, verificationUrl: string): Promise<void> {
    const mailOptions = {
      from: 'artemisa.vet.solutions@gmail.com',  
      to: email,  
      subject: 'Verificación de correo electrónico',
      html: verificationRegisterEmailTemplate(name, verificationUrl),  
    };

    await this.sendMail(mailOptions);
  }
}

