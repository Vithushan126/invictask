import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_HOST'),
      port: this.config.get<number>('MAIL_PORT'),
      secure: true,
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendResetEmail(to: string, subject: string, token: string) {
    await this.transporter.sendMail({
      from: `"Support" <${this.config.get<string>('MAIL_USER')}>`,
      to,
      subject,
      html: `<p>Click <a href="${token}">here</a> to reset your password. This link is valid for 15 minutes.</p>`,
    });
  }
}
