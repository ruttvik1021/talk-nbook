import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class TimeSlots {
  @Prop()
  from: string;

  @Prop()
  to: string;
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
    },
  },
})
export class Slots {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  slots: TimeSlots[];
}

export type SlotsDocument = Slots & Document;
export const SlotSchema = SchemaFactory.createForClass(Slots);
export const SLOTS_MODEL = Slots.name;

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
export class SlotBookings {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  slots: string[];
}

export type SlotBookingsDocument = SlotBookings & Document;
export const SlotBookingSchema = SchemaFactory.createForClass(SlotBookings);
export const SLOTSBOOKING_MODEL = SlotBookings.name;
