import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SEND_OTP_MODEL, SendOtpSchema } from 'src/schemas/sendotp-schema';
import { USER_MODEL, UserSchema } from 'src/schemas/user-schema';
import {
  VALIDATE_OTP_MODEL,
  ValidateOtpSchema,
} from 'src/schemas/validateotp-schema';
import { OtpflowController } from './otpflow.controller';
import { OtpflowService } from './otpflow.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' }, // Your other sign options here
      }),
      inject: [ConfigService],
    }),
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
