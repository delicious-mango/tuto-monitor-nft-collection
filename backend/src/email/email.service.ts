import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly _transporter = createTransport(
    {
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    },
    {
      from: `Cryptomancy <${process.env.EMAIL_USER}>`,
    },
  );

  constructor() {
    this._transporter.verify().then(() => {
      console.log('Ready to send emails');
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    await this._transporter.sendMail({ to, subject, text });
  }
}
