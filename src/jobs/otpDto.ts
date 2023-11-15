import { IsEmail, IsInt } from 'class-validator';
import { otpMessages } from 'src/otpflow/otpflow-contants';

export class SendOtpDTO {
  @IsEmail({}, { message: otpMessages.errors.EMAIL_MUST_BE_VALID })
  email: string;
}

export class ValidateOtpDTO {
  @IsEmail({}, { message: otpMessages.errors.EMAIL_MUST_BE_VALID })
  email: string;

  @IsInt()
  otp: number;
}
