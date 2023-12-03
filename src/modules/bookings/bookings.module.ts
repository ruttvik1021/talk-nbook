import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BOOKINGDETAILS_MODEL,
  BookingDetailsSchema,
} from 'src/schemas/booking-details-schema';
import { SLOTS_MODEL, SlotSchema } from 'src/schemas/slots-schema';
import { USER_MODEL, UserSchema } from 'src/schemas/user-schema';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BOOKINGDETAILS_MODEL, schema: BookingDetailsSchema },
      { name: USER_MODEL, schema: UserSchema },
      { name: SLOTS_MODEL, schema: SlotSchema },
    ]),
  ],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}
