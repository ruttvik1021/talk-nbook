import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewsDTO } from 'src/dtos/reviewsAndReportsDto';
import { decodedRequest } from 'src/middlewares/token-validator-middleware';
import {
  REVIEWS_MODEL,
  ReviewsDocument,
} from 'src/schemas/reviews-reports-schema';
import { reviewMessages } from 'src/utils/constants';

@Injectable()
export class ReviewsAndReportsService {
  constructor(
    @InjectModel(REVIEWS_MODEL)
    private readonly reviewModel: Model<ReviewsDocument>,
  ) {}

  async postReview(req: decodedRequest, body: ReviewsDTO) {
    const customerId = req.user.id;
    const { userId, ratings, review } = body;
    const isReviewAvailable = await this.reviewModel.findOne({
      userId,
      customerId,
    });
    if (isReviewAvailable)
      throw new BadRequestException(
        reviewMessages.error.alreadyRatedPleaseUpdateTheExistingReview,
      );

    const addReview = await this.reviewModel.create({
      userId,
      customerId,
      ratings,
      review,
    });
    if (!addReview)
      throw new BadRequestException(
        reviewMessages.error.errorWhileAddingReview,
      );
    return { message: reviewMessages.messages.reviewAddedSuccessfully };
  }

  async updateReview(req: decodedRequest, body: ReviewsDTO) {
    const customerId = req.user.id;
    const { userId, ratings, review } = body;
    const isReviewAvailable = await this.reviewModel.findOne({
      userId,
      customerId,
    });
    if (!isReviewAvailable)
      throw new BadRequestException(reviewMessages.error.reviewNotFound);

    const updatedReview = await this.reviewModel.findOneAndUpdate(
      { userId, customerId },
      { ...body },
      { returnOriginal: true },
    );

    if (!updatedReview)
      throw new BadRequestException(
        reviewMessages.error.errorWhileUpdatingReview,
      );

    return {
      message: reviewMessages.messages.reviewUpdatedSuccessfully,
    };
  }

  async deleteReview(req: decodedRequest, id: string) {
    const review = await this.reviewModel.findById(id);
    if (!review)
      throw new BadRequestException(reviewMessages.error.reviewNotFound);

    const deletedReview = await this.reviewModel.findByIdAndDelete(id);
    if (!deletedReview)
      throw new BadRequestException(
        reviewMessages.error.errorWhileDeletingReview,
      );
    return { message: reviewMessages.messages.reviewDeletedSuccessfully };
  }
}
