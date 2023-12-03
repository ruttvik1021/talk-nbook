import { Module } from '@nestjs/common';
import { ReviewsAndReportsService } from './reviews-and-reports.service';
import { ReviewsAndReportsController } from './reviews-and-reports.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  REVIEWS_MODEL,
  ReviewsSchema,
} from 'src/schemas/reviews-reports-schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: REVIEWS_MODEL, schema: ReviewsSchema }]),
  ],
  providers: [ReviewsAndReportsService],
  controllers: [ReviewsAndReportsController],
})
export class ReviewsAndReportsModule {}
