import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from 'src/mail/mail.service';
import { SEND_OTP_MODEL, SendOtpDocument } from 'src/schemas/sendotp-schema';
import { USER_MODEL, UserDocument } from 'src/schemas/user-schema';
import { RoleEnums } from 'src/utils/enums';
import { otpMessages } from '../../utils/constants';

@Injectable()
export class OtpflowService {
  constructor(
    @InjectModel(SEND_OTP_MODEL)
    private readonly sendOtpModel: Model<SendOtpDocument>,

    @InjectModel(USER_MODEL)
    private readonly userModel: Model<UserDocument>,

    private readonly configService: ConfigService,

    private readonly jwtService: JwtService,

    private readonly mailerService: MailerService,
  ) {}

  async sendOtpToUser(userEmail: string, userType: RoleEnums) {
    if (userType === RoleEnums.SUPERADMIN) {
      const user = await this.userModel.findOne({ email: userEmail });
      if (!user || user.role !== RoleEnums.SUPERADMIN)
        throw new UnauthorizedException();
    }
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
      await this.mailerService.sendMail({
        to: userEmail,
        subject: 'Otp for Login',
        otp: `${generatedOtp}`,
        type: 'Signup',
        validfor: validSeconds,
      });
      if (!otpSent)
        throw new BadRequestException(otpMessages.errors.somethingWentWrong);

      return {
        message: otpMessages.messages.otpSent,
        validfor: validSeconds,
      };
    }
    // if (new Date(getEmailLog.validTill) > new Date()) {
    //   throw new BadRequestException(otpMessages.errors.orpAlreadySent);
    // }
    const updatedOtp = await this.sendOtpModel.findOneAndUpdate(
      {
        email: userEmail,
      },
      {
        otp: generatedOtp,
        validTill: validTill,
      },
    );
    await this.sendOtpModel.deleteMany({ validTill: { $lt: new Date() } });
    await this.mailerService.sendMail({
      to: userEmail,
      subject: 'Otp for Login',
      otp: `${generatedOtp}`,
      type: 'Login',
      validfor: validSeconds,
    });
    if (!updatedOtp)
      throw new BadRequestException(otpMessages.errors.somethingWentWrong);
    return {
      message: otpMessages.messages.otpSent,
      validfor: validSeconds,
    };
  }

  async validateOtp({ email, otp }: { email: string; otp: number }) {
    const jwtSecret = this.configService.get('JWT_SECRET')!;
    const jwtExpiresIn = this.configService.get('JWT_EXPIRES_IN')!;
    const getEmailLog = await this.sendOtpModel.findOne({ email: email });

    if (!getEmailLog) {
      throw new BadRequestException(otpMessages.errors.noUserFound);
    }

    if (getEmailLog.otp !== otp) {
      throw new BadRequestException(otpMessages.errors.wrongOtp);
    }

    if (new Date(getEmailLog.validTill) < new Date()) {
      throw new BadRequestException(otpMessages.errors.otpExpired);
    }

    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      const createdUser = await this.userModel.create({ email: email });

      const accessToken = await this.jwtService.signAsync(
        {
          email: createdUser.email,
          role: createdUser.role,
          id: createdUser._id,
        },
        { secret: jwtSecret, expiresIn: jwtExpiresIn },
      );

      if (createdUser) {
        return {
          accessToken: accessToken,
          isProfileComplete: false,
        };
      }
    }

    const accessToken = await this.jwtService.signAsync(
      {
        email: user.email,
        role: user.role,
        id: user._id,
      },
      { secret: jwtSecret, expiresIn: jwtExpiresIn },
    );

    return {
      accessToken: accessToken,
      isProfileCompleted: user.isProfileComplete,
    };
  }
}
