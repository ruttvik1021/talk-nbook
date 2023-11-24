import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { SEND_OTP_MODEL, SendOtpSchema } from 'src/schemas/sendotp-schema';
import { USER_MODEL, UserSchema } from 'src/schemas/user-schema';
import { OtpflowController } from './otpflow.controller';
import { OtpflowService } from './otpflow.service';
import { MailerService } from '../../mail/mail.service';

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
      { name: USER_MODEL, schema: UserSchema },
    ]),
    ConfigModule.forRoot(),
  ],
  providers: [OtpflowService, MailerService],
  controllers: [OtpflowController],
})
export class OtpflowModule {}
