import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BOOKINGDETAILS_MODEL,
  BookingDetailsSchema,
} from 'src/schemas/booking-details-schema';
import { SLOTS_MODEL, SlotSchema } from 'src/schemas/slots-schema';
import { USER_MODEL, UserSchema } from 'src/schemas/user-schema';
import { MailerService } from '../../mail/mail.service';
import { BookslotsController } from './bookslots.controller';
import { BookslotsService } from './bookslots.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODEL, schema: UserSchema },
      { name: SLOTS_MODEL, schema: SlotSchema },
      { name: BOOKINGDETAILS_MODEL, schema: BookingDetailsSchema },
    ]),
    ConfigModule.forRoot(),
  ],
  controllers: [BookslotsController],
  providers: [BookslotsService, MailerService],
})
export class BookslotsModule {}
