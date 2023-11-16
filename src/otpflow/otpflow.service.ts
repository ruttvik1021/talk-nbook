import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SEND_OTP_MODEL, SendOtpDocument } from 'src/schemas/sendotp-schema';
import { otpMessages } from './otpflow-contants';
import {
  VALIDATE_OTP_MODEL,
  ValidateOtpDocument,
} from 'src/schemas/validateotp-schema';

const otpSentResponse = (validSec: string) => {
  return {
    message: otpMessages.messages.OTP_SENT,
    validfor: validSec,
  };
};

@Injectable()
export class OtpflowService {
  constructor(
    @InjectModel(SEND_OTP_MODEL)
    private readonly sendOtpModel: Model<SendOtpDocument>,

    @InjectModel(VALIDATE_OTP_MODEL)
    private readonly validateOtpModel: Model<ValidateOtpDocument>,

    private readonly configService: ConfigService,
  ) {}

  async sendOtpToUser(userEmail: string) {
    const validSeconds = this.configService.get('OTP_VALID_SECOND');
    const generatedOtp = Math.floor(100000 + Math.random() * 900000);
    const validTill = new Date(new Date().getTime() + validSeconds * 1000);
    const getEmailLog = await this.sendOtpModel.findOne({ email: userEmail });
    if (!getEmailLog) {
      const otpSent = await this.sendOtpModel.create({
        email: userEmail,
        validTill: validTill,
        otp: generatedOtp,
      });
      if (!otpSent)
        throw new BadRequestException(otpMessages.errors.SOMETHING_WENT_WRONG);
      return otpSentResponse(validSeconds);
    }
    if (new Date(getEmailLog.validTill) > new Date()) {
      throw new BadRequestException(otpMessages.errors.OTP_ALREADY_SENT);
    }
    const updatedOtp = await this.sendOtpModel.findOneAndUpdate({
      email: userEmail,
      otp: generatedOtp,
      validTill: validTill,
    });
    if (!updatedOtp)
      throw new BadRequestException(otpMessages.errors.SOMETHING_WENT_WRONG);
    return otpSentResponse(validSeconds);
  }

  async validateOtp({ email, otp }: { email: string; otp: number }) {
    const getEmailLog = await this.sendOtpModel.findOne({ email: email });
    if (new Date(getEmailLog.validTill) < new Date()) {
      throw new BadRequestException(otpMessages.errors.OTP_EXPIRED);
    }

    if (getEmailLog.otp !== otp) {
      throw new BadRequestException(otpMessages.errors.WRONG_OTP);
    }

    return true;
  }
}
