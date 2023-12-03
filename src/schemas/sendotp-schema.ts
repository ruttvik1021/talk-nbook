import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      // Exclude fields when converting the document to JSON
      ret.id = ret._id;
      delete ret.createdAt;
      delete ret.updatedAt;
      delete ret.__v;
      delete ret._id;
    },
  },
})
export class SendOtp {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  validTill: Date;

  @Prop({ required: true })
  otp: number;
}

export type SendOtpDocument = SendOtp & Document;

export const SendOtpSchema = SchemaFactory.createForClass(SendOtp);

export const SEND_OTP_MODEL = SendOtp.name;
