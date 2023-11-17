import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class ValidateOtp {
  @Prop()
  email: String;

  @Prop()
  otp: Number;
}

export type ValidateOtpDocument = ValidateOtp & Document;

export const ValidateOtpSchema = SchemaFactory.createForClass(ValidateOtp);

export const VALIDATE_OTP_MODEL = ValidateOtp.name;
