import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class SendOtp {
  @Prop({ required: true })
  email: String;

  @Prop({ required: true })
  validTill: Date;

  @Prop({ required: true })
  otp: Number;
}

export type SendOtpDocument = SendOtp & Document;

export const SendOtpSchema = SchemaFactory.createForClass(SendOtp);

export const SEND_OTP_MODEL = SendOtp.name;
