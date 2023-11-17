import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Language {
  @Prop({ required: true })
  language: String;

  @Prop({ default: true })
  isActive: Boolean;
}

export type LanguageDocument = Language & Document;

export const LanguageSchema = SchemaFactory.createForClass(Language);

export const LANGUAGE_MODEL = Language.name;
