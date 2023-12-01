import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GENDER } from 'src/dtos/userDto';

class Certifications {
  @Prop()
  name: string;

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
      ret.id = ret._id;
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

  @Prop({ required: true, default: 'USER' })
  role: string;

  @Prop({ default: '' })
  about: string;

  @Prop({ default: '' })
  dateOfBirth: string;

  @Prop({ enum: GENDER })
  gender: GENDER;

  @Prop({ default: '' })
  profilePhoto: string;

  @Prop({ type: [String] })
  prefferedSpecializations: string[];

  @Prop({ default: false })
  isServiceProvider: boolean;

  @Prop({ default: false })
  onSiteService: boolean;

  @Prop({ required: false, type: [String] })
  locations: string[];

  @Prop({ type: [Specialization] })
  @Prop({ required: false })
  specializations: Specialization[];

  @Prop({ type: [String] })
  languages: string[];

  @Prop({ required: true, default: false })
  isProfileComplete: boolean;
}

export type UserDocument = Users & Document;

export const UserSchema = SchemaFactory.createForClass(Users);

export const USER_MODEL = Users.name;
