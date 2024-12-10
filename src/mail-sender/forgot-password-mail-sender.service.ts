import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailConfig } from 'src/common/config/email.config';
import { IForgotPasswordService } from './interfaces/forgot-password-service.interface';
import { resetPasswordEmailTemplate } from './emails/forgot-password-request.template';

@Injectable()
export class  ForgotPasswordMailSenderService extends MailConfig implements IForgotPasswordService{
  constructor(
    private readonly configService: ConfigService
  ) {
    super();  
  }

  async sendForgotPasswordEmail(email: string, name: string, verificationUrl: string): Promise<void> {
    const mailOptions = {
      from: 'artemisa.vet.solutions@gmail.com',  
      to: email,  
      subject: 'Cambio de contraseña',
      html: resetPasswordEmailTemplate(name, verificationUrl),
    };

    await this.sendMail(mailOptions);
  }
}



