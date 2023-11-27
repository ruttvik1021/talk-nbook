import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BookingStatus } from './slots-schema';

@Schema({
  timestamps: true,
})
export class Bookings {
  @Prop()
  customerId: string;

  @Prop()
  userId: string;

  @Prop()
  slotDateId: string;

  @Prop()
  slotTimeId: string;

  @Prop()
  status: BookingStatus;
}

export type BookingsDocument = Bookings & Document;
export const BookingSchema = SchemaFactory.createForClass(Bookings);
export const BOOKINGS_MODEL = Bookings.name;
