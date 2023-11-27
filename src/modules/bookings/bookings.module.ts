import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BOOKINGS_MODEL, BookingSchema } from 'src/schemas/bookings-schema';
import { USER_MODEL, UserSchema } from 'src/schemas/user-schema';
import { SLOTS_MODEL, SlotSchema } from 'src/schemas/slots-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BOOKINGS_MODEL, schema: BookingSchema },
      { name: USER_MODEL, schema: UserSchema },
      { name: SLOTS_MODEL, schema: SlotSchema },
    ]),
  ],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}
