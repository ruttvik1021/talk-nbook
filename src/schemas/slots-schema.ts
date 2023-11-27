import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum BookingStatus {
  BOOKED = 'Booked',
  VACANT = 'Vacant',
  LAPSED = 'Lapsed',
}

export enum PaymentStatus {
  SUCCESS = 'Success',
  FAIL = 'Fail',
}

class TimeSlots {
  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  status: BookingStatus;

  @Prop()
  customerId: string;

  @Prop()
  id: string;
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

  @Prop({ type: [TimeSlots], default: [], required: true })
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

@Schema({
  timestamps: true,
})
export class SlotRequests {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  slot: TimeSlots;

  @Prop({ required: true })
  paymentStatus: PaymentStatus;
}

export type SlotRequestDocument = SlotRequests & Document;
export const SlotRequestScheme = SchemaFactory.createForClass(SlotRequests);
export const SLOT_REQUEST_MODEL = SlotRequests.name;
