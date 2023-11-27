import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SLOTSBOOKING_MODEL,
  SLOTS_MODEL,
  SlotBookingSchema,
  SlotSchema,
} from 'src/schemas/slots-schema';
import { USER_MODEL, UserSchema } from 'src/schemas/user-schema';
import { BookslotsController } from './bookslots.controller';
import { BookslotsService } from './bookslots.service';
import { MailerService } from '../../mail/mail.service';
import { ConfigModule } from '@nestjs/config';
import { BOOKINGS_MODEL, BookingSchema } from 'src/schemas/bookings-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODEL, schema: UserSchema },
      { name: SLOTSBOOKING_MODEL, schema: SlotBookingSchema },
      { name: SLOTS_MODEL, schema: SlotSchema },
      { name: BOOKINGS_MODEL, schema: BookingSchema },
    ]),
    ConfigModule.forRoot(),
  ],
  controllers: [BookslotsController],
  providers: [BookslotsService, MailerService],
})
export class BookslotsModule {}
