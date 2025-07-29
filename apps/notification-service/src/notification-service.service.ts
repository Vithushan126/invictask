import { Injectable } from '@nestjs/common';
import { MailService } from './mail/mail.service';

@Injectable()
export class NotificationServiceService {
  constructor(private MailService: MailService) {}

  async handleSendResetEmail(data: {
    to: string;
    subject: string;
    token: string;
  }) {
    await this.MailService.sendResetEmail(data.to, data.subject, data.token);
    return { status: 'Email sent' };
  }
}
