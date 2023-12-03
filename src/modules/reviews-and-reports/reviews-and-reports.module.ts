import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BOOKINGDETAILS_MODEL,
  BookingDetailsSchema,
} from 'src/schemas/booking-details-schema';
import {
  REVIEWS_MODEL,
  ReviewsSchema,
} from 'src/schemas/reviews-reports-schema';
import { ReviewsAndReportsController } from './reviews-and-reports.controller';
import { ReviewsAndReportsService } from './reviews-and-reports.service';
import { USER_MODEL, UserSchema } from 'src/schemas/user-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: REVIEWS_MODEL, schema: ReviewsSchema },
      { name: BOOKINGDETAILS_MODEL, schema: BookingDetailsSchema },
      { name: USER_MODEL, schema: UserSchema },
    ]),
  ],
  providers: [ReviewsAndReportsService],
  controllers: [ReviewsAndReportsController],
})
export class ReviewsAndReportsModule {}
