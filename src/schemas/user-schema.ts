import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Users {
  @Prop({ required: true })
  email: string;

  @Prop({ default: '' })
  mobileNumber: string;

  @Prop({ default: '' })
  name: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: null })
  role: string;

  @Prop({ default: '' })
  dateOfBirth: string;

  @Prop({ default: '' })
  gender: string;

  @Prop()
  profilePicType: string;

  @Prop()
  profilePic: string;

  @Prop()
  preferences: string[];

  @Prop()
  languages: string[];

  @Prop({ required: true, default: false })
  isProfileComplete: boolean;
}

export type UserDocument = Users & Document;

export const UserSchema = SchemaFactory.createForClass(Users);

export const USER_MODEL = Users.name;
