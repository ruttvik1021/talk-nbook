import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SEND_OTP_MODEL, SendOtpDocument } from 'src/schemas/sendotp-schema';
import { otpMessages } from './../constants';
import {
  VALIDATE_OTP_MODEL,
  ValidateOtpDocument,
} from 'src/schemas/validateotp-schema';
import { USER_MODEL, UserDocument } from 'src/schemas/user-schema';
import { GENDER, createUserDTO } from 'src/dtos/userDto';

@Injectable()
export class OtpflowService {
  constructor(
    @InjectModel(SEND_OTP_MODEL)
    private readonly sendOtpModel: Model<SendOtpDocument>,

    @InjectModel(VALIDATE_OTP_MODEL)
    private readonly validateOtpModel: Model<ValidateOtpDocument>,

    @InjectModel(USER_MODEL)
    private readonly userModel: Model<UserDocument>,

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
      return {
        message: otpMessages.messages.OTP_SENT,
        validfor: validSeconds,
        otp: generatedOtp,
      };
    }
    if (new Date(getEmailLog.validTill) > new Date()) {
      throw new BadRequestException(otpMessages.errors.OTP_ALREADY_SENT);
    }
    const updatedOtp = await this.sendOtpModel.findOneAndUpdate(
      {
        email: userEmail,
      },
      {
        otp: generatedOtp,
        validTill: validTill,
      },
    );
    if (!updatedOtp)
      throw new BadRequestException(otpMessages.errors.SOMETHING_WENT_WRONG);
    return {
      message: otpMessages.messages.OTP_SENT,
      validfor: validSeconds,
      otp: generatedOtp,
    };
  }

  async validateOtp({ email, otp }: { email: string; otp: number }) {
    const getEmailLog = await this.sendOtpModel.findOne({ email: email });

    if (getEmailLog.otp !== otp) {
      throw new BadRequestException(otpMessages.errors.WRONG_OTP);
    }

    if (new Date(getEmailLog.validTill) < new Date()) {
      throw new BadRequestException(otpMessages.errors.OTP_EXPIRED);
    }

    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      const createdUser = await this.userModel.create({ email: email });
      if (createdUser) {
        return {
          accessToken: createdUser.email,
          isProfileComplete: false,
        };
      }
    }

    return {
      accessToken: user.email,
      isProfileCompleted: user.isProfileComplete,
    };
  }

  async sendToken(userEmail: string) {
    const user = await this.userModel.findOne({ email: userEmail });
    if (!user) throw new BadRequestException(otpMessages.errors.NO_USER_FOUND);
    return { ...user };
  }

  async createUser(body: createUserDTO) {
    // const user = await this.userModel.create({ ...body });
    return { ...body };
  }
}
