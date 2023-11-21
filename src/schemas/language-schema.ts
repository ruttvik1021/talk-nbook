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
export class Language {
  @Prop({ required: true })
  language: string;

  @Prop({ default: true })
  isActive: boolean;
}

export type LanguageDocument = Language & Document;

export const LanguageSchema = SchemaFactory.createForClass(Language);

export const LANGUAGE_MODEL = Language.name;
