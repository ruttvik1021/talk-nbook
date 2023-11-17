import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Users {
  @Prop({ required: true })
  email: String;

  @Prop({ default: '' })
  mobileNumber: String;

  @Prop({ default: '' })
  name: String;

  @Prop({ default: false })
  isActive: Boolean;

  @Prop({ default: null })
  role: String;

  @Prop({ default: '' })
  dateOfBirth: String;

  @Prop({ default: '' })
  gender: String;

  @Prop()
  profilePicType: String;

  @Prop()
  profilePic: String;

  @Prop()
  preferences: String[];

  @Prop()
  languages: String[];

  @Prop({ required: true, default: false })
  isProfileComplete: Boolean;
}

export type UserDocument = Users & Document;

export const UserSchema = SchemaFactory.createForClass(Users);

export const USER_MODEL = Users.name;
