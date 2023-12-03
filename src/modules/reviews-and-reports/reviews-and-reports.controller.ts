import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ReviewsDTO } from 'src/dtos/reviewsAndReportsDto';
import { authorizedUrls, reviewAndReportsUrls } from 'src/utils/urls';
import { ReviewsAndReportsService } from './reviews-and-reports.service';

@Controller(authorizedUrls)
export class ReviewsAndReportsController {
  constructor(
    private readonly reviewAndReportService: ReviewsAndReportsService,
  ) {}
  @Post(reviewAndReportsUrls.review)
  async postReview(@Body() body: ReviewsDTO, @Req() req: Request) {
    return this.reviewAndReportService.postReview(req, body);
  }
}
