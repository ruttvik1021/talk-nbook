import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { BookingStatus } from 'src/schemas/slots-schema';

interface ISendMail {
  to: string;
  subject: string;
  otp: string;
  type: 'Signup' | 'Login';
  validfor: string;
}

interface IBookingStatus {
  subject: string;
  serviceProviderName: string;
  date: string;
  slotTimefrom: string;
  slotTimeto: string;
  bookingId: string;
  userName?: string;
  userEmail: string;
  status: BookingStatus;
}

@Injectable()
export class MailerService {
  private readonly transporter;
  private readonly configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
    const userNameForEmail = this.configService.get('NODEMAILER_USER');
    const passwordForEmail = this.configService.get('NODEMAILER_PASS');
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: userNameForEmail,
        pass: passwordForEmail,
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
        <h1>Welcome back user</h1>
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

  async bookingStatus({
    subject,
    serviceProviderName,
    date,
    slotTimefrom,
    slotTimeto,
    bookingId,
    userName,
    userEmail,
    status,
  }: IBookingStatus) {
    const bookingMailTemplate = `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking ${
          BookingStatus.BOOKED
            ? 'Confirmed'
            : BookingStatus.CANCELLED
              ? BookingStatus.CANCELLED
              : BookingStatus.LAPSED
                ? 'Initiated'
                : ''
        }</title>
      </head>
      <body>
        <h1>Hey ${userName ? userName : 'User'}</h1>
        <p>Your slot has been ${
          BookingStatus.BOOKED
            ? 'confirmed'
            : BookingStatus.CANCELLED
              ? 'cancelled'
              : BookingStatus.LAPSED
                ? 'initiated'
                : ''
        } with ${serviceProviderName}. Below are the booking details:</p>
        <p>Date: ${date} from ${slotTimefrom} to ${slotTimeto}</p>
        ${
          !BookingStatus.CANCELLED
            ? `<p>This is your BookingId for your ref. <strong>${bookingId}</strong></p>`
            : ''
        }
      </body>
      </html>`;

    const mailOptions = {
      from: 'Talk-n-book@gmail.com',
      to: userEmail,
      subject,
      html: bookingMailTemplate,
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
