import { Response } from 'express';
import { BadRequestException, Body, Controller, Get, Inject, Patch, Query, Res } from '@nestjs/common';

import { registrationSuccessEmailTemplate } from 'src/mail-sender/emails/registration-success.email.template';
import { TokensService } from './tokens.service';
import { NewPasswordDto } from 'src/users/dto/new-password.dto';

@Controller('tokens')
export class TokensController {
  constructor(
    private readonly tokensService: TokensService
  ) { }
  
  @Get('verify-email')
  async verify(@Query('token') token: string, @Res() res: Response) {
    try {
      const tokenVerified = await this.tokensService.verifyTokenConfirmationEmail(token);
      if (!tokenVerified) {
        return res.status(400).json({ message: 'Error verifying user' });
      }
   
      const htmlContent = registrationSuccessEmailTemplate();
      return res.status(200).send(htmlContent).type('html');
      
    } catch (error) { 
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error verifying user', error: error.message });
      }
    }

  }

  @Patch('change-password')
  async changePassword(@Query('token') token: string, @Body() newPassword: NewPasswordDto) {

      const { password } = newPassword;
      const tokenVerified = await this.tokensService.verifiTokenChangePassworg(token, password);
      if (!tokenVerified) 
        throw new BadRequestException('Error changing password');

      return { message: 'Password changed successfully' }
  }

}


