import { Prop, Schema } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class ValidateOtp {
  @Prop()
  email: string;

  @Prop()
  otp: number;
}
