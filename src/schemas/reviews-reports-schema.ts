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
export class Reviews {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true, default: 0 })
  ratings: number;

  @Prop({ default: '' })
  review: string;
}

export type ReviewsDocument = Reviews & Document;
export const ReviewsSchema = SchemaFactory.createForClass(Reviews);
export const REVIEWS_MODEL = Reviews.name;
