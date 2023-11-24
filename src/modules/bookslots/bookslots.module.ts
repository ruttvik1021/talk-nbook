import { Module } from '@nestjs/common';
import { BookslotsController } from './bookslots.controller';
import { BookslotsService } from './bookslots.service';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODEL, UserSchema } from 'src/schemas/user-schema';
import {
  SLOTSBOOKING_MODEL,
  SlotBookingSchema,
} from 'src/schemas/slots-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODEL, schema: UserSchema },
      { name: SLOTSBOOKING_MODEL, schema: SlotBookingSchema },
    ]),
  ],
  controllers: [BookslotsController],
  providers: [BookslotsService],
})
export class BookslotsModule {}
