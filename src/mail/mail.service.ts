import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private emailerService: MailerService) {}

  async emailSend(email: string) {
    try {
      const number: number = Math.floor(100000 + Math.random() * 900000);

      await this.emailerService.sendMail({
        to: email,
        from: process.env.MAIL_SNED_FROM,
        subject: '이메일 인증 요청 메일입니다.',
        html: '6자리 인증 코드 : ' + `<b>${number}</b>`,
      });

      return {
        success: true,
        authNumber: number,
      };
    } catch (error) {
      return {
        error: error,
        success: false,
      };
    }
  }
}
