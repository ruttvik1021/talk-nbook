import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { ReviewsDTO } from 'src/dtos/reviewsAndReportsDto';
import { authorizedUrls, reviewAndReportsUrls } from 'src/utils/urls';
import { ReviewsAndReportsService } from './reviews-and-reports.service';
import { ObjectIdValidationPipe } from 'src/pipes/objectIdValidationPipe';

@Controller(authorizedUrls)
export class ReviewsAndReportsController {
  constructor(
    private readonly reviewAndReportService: ReviewsAndReportsService,
  ) {}
  @Post(reviewAndReportsUrls.review)
  postReview(@Body() body: ReviewsDTO, @Req() req: Request) {
    return this.reviewAndReportService.postReview(req, body);
  }

  @Get(reviewAndReportsUrls.reviews)
  getReviewsGivenByUser(@Req() req: Request) {
    return this.reviewAndReportService.getReviewsGivenByUser(req);
  }

  @Get(reviewAndReportsUrls.reviewOfServiceProvider)
  getReviewsOfServiceProvider(
    @Param('id', ObjectIdValidationPipe) userId: string,
  ) {
    return this.reviewAndReportService.getReviewsOfServiceProvider(userId);
  }

  @Delete(reviewAndReportsUrls.deleteReview)
  deleteReview(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.reviewAndReportService.deleteReview(id);
  }

  @Put(reviewAndReportsUrls.review)
  updateReview(@Req() req: Request, @Body() body: ReviewsDTO) {
    return this.reviewAndReportService.updateReview(req, body);
  }
}
