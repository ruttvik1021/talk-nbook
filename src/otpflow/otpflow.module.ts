import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SEND_OTP_MODEL, SendOtpSchema } from 'src/schemas/sendotp-schema';
import { OtpflowController } from './otpflow.controller';
import { OtpflowService } from './otpflow.service';
import {
  VALIDATE_OTP_MODEL,
  ValidateOtpSchema,
} from 'src/schemas/validateotp-schema';
import { USER_MODEL, UserSchema } from 'src/schemas/user-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SEND_OTP_MODEL, schema: SendOtpSchema },
      { name: VALIDATE_OTP_MODEL, schema: ValidateOtpSchema },
      { name: USER_MODEL, schema: UserSchema },
    ]),
    ConfigModule.forRoot(),
  ],
  providers: [OtpflowService],
  controllers: [OtpflowController],
})
export class OtpflowModule {}
