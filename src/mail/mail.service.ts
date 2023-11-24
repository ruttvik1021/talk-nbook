import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface ISendMail {
  to: string;
  subject: string;
  otp: string;
  type: 'Signup' | 'Login';
  validfor: string;
}

@Injectable()
export class MailerService {
  private readonly transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rktesting2022@gmail.com',
        pass: 'ekai eyao wszq xtqf',
      },
    });
  }

  async sendMail({ to, subject, otp, type, validfor }: ISendMail) {
    const signUpTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to TalkNBook</title>
      </head>
      <body>
        <h1>Welcome to TalkNBook</h1>
        <p>We are glad to have you on our platform.</p>
        <p>Here is your OTP for signup: <strong>${otp}</strong></p>
        <p>Valid for: <strong>${validfor} seconds</strong></p>
      </body>
      </html>
    `;

    const loginTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome Back</title>
      </head>
      <body>
        <p>Here is your OTP for login: <strong>${otp}</strong></p>
        <p>Valid for: <strong>${validfor} seconds</strong></p>
      </body>
      </html>
    `;

    const text = type === 'Login' ? loginTemplate : signUpTemplate;

    const mailOptions = {
      from: 'Talk-n-book@gmail.com',
      to,
      subject,
      html: text,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
