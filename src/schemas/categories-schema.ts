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
export class Specialization {
  @Prop({ required: true })
  specialization: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  preffered: boolean;
}

export type SpecializationDocument = Specialization & Document;

export const SpecializationSchema =
  SchemaFactory.createForClass(Specialization);

export const SPECIALIZATION_MODEL = Specialization.name;
