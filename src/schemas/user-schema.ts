import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GENDER } from 'src/dtos/userDto';

class Certifications {
  @Prop()
  name: string;

  @Prop()
  photoType: string;

  @Prop()
  photo: string;
}

@Schema()
class Specialization {
  @Prop()
  specializationId: string;

  @Prop({ type: [Certifications] }) // Specify the array type
  certificates: Certifications[];
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      // Exclude fields when converting the document to JSON
      delete ret.createdAt;
      delete ret.updatedAt;
      delete ret.__v;
      delete ret._id;
      delete ret.isProfileComplete;
    },
  },
})
export class Users {
  @Prop({ required: true })
  email: string;

  @Prop({ default: '' })
  mobileNumber: string;

  @Prop({ default: '' })
  name: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: '' })
  role: string;

  @Prop({ default: '' })
  dateOfBirth: string;

  @Prop({ enum: GENDER })
  gender: GENDER;

  @Prop()
  profilePicType: string;

  @Prop()
  profilePic: string;

  @Prop({ type: [String] }) // Specify the array type
  preferences: string[];

  @Prop({ default: false })
  isServiceProvider: boolean;

  @Prop({ type: [Specialization] }) // Specify the array type
  @Prop({ required: false }) // If specializations can be empty
  specializations: Specialization[];

  @Prop({ type: [String] }) // Specify the array type
  languages: string[];

  @Prop({ required: true, default: false })
  isProfileComplete: boolean;
}

export type UserDocument = Users & Document;

export const UserSchema = SchemaFactory.createForClass(Users);

export const USER_MODEL = Users.name;
