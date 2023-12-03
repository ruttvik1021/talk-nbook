import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
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
