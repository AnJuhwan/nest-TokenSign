import { MailService } from './mail.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('api/mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() body: { email: string }) {
    return this.mailService.emailSend(body.email);
  }
}
