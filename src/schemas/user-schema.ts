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
    },
  },
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

  @Prop({ default: '' })
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
