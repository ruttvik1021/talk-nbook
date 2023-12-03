import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BookingStatus } from 'src/utils/enums';

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
export class BookingDetails {
  @Prop()
  customerId: string;

  @Prop()
  customerName: string;

  @Prop()
  userId: string;

  @Prop()
  userName: string;

  @Prop()
  slotDateId: string;

  @Prop()
  slotTimeId: string;

  @Prop()
  status: BookingStatus;
}

export type BookingDetailsDocument = BookingDetails & Document;
export const BookingDetailsSchema =
  SchemaFactory.createForClass(BookingDetails);
export const BOOKINGDETAILS_MODEL = BookingDetails.name;
