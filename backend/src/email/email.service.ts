/*
| Developed by Starton
| Filename : email.service.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

/*
|--------------------------------------------------------------------------
| MAILING SERVICE
|--------------------------------------------------------------------------
*/
@Injectable()
export class EmailService {
  // Utility object to send emails
  //--------------------------------------------------------------------------
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

  // Verify SMTP configuration at construction
  //--------------------------------------------------------------------------
  constructor() {
    this._transporter.verify().then(() => {
      console.log('Ready to send emails');
    });
  }

  // Send an email
  //--------------------------------------------------------------------------
  async sendEmail(to: string, subject: string, text: string) {
    await this._transporter.sendMail({ to, subject, text });
  }
}
