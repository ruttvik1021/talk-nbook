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
export class Categories {
  @Prop({ type: String, required: true })
  category: string;

  @Prop({ default: true })
  isActive: Boolean;
}

export type CategoryDocument = Categories & Document;

export const CategorySchema = SchemaFactory.createForClass(Categories);

export const CATEGORY_MODEL = Categories.name;
