import { IsEmail, IsInt } from 'class-validator';
import { otpMessages } from '../utils/constants';

export class SendOtpDTO {
  @IsEmail({}, { message: otpMessages.errors.emailMustBeValid })
  email: string;
}

export class ValidateOtpDTO {
  @IsEmail({}, { message: otpMessages.errors.emailMustBeValid })
  email: string;

  @IsInt()
  otp: number;
}
