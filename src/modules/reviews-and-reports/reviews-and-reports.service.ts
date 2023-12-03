import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewsDTO } from 'src/dtos/reviewsAndReportsDto';
import { decodedRequest } from 'src/middlewares/token-validator-middleware';
import {
  BOOKINGDETAILS_MODEL,
  BookingDetailsDocument,
} from 'src/schemas/booking-details-schema';
import {
  REVIEWS_MODEL,
  ReviewsDocument,
} from 'src/schemas/reviews-reports-schema';
import { USER_MODEL, UserDocument } from 'src/schemas/user-schema';
import { reviewMessages } from 'src/utils/constants';
import { BookingStatus } from 'src/utils/enums';

@Injectable()
export class ReviewsAndReportsService {
  constructor(
    @InjectModel(REVIEWS_MODEL)
    private readonly reviewModel: Model<ReviewsDocument>,

    @InjectModel(BOOKINGDETAILS_MODEL)
    private readonly bookingDetailsModel: Model<BookingDetailsDocument>,

    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
  ) {}

  async postReview(req: decodedRequest, body: ReviewsDTO) {
    const customerId = req.user.id;
    const { userId, ratings, review } = body;
    const isServiceUsed = await this.bookingDetailsModel.find(
      {
        userId,
        customerId,
      },
      { status: BookingStatus.EXPIRED },
    );
    if (!isServiceUsed.length)
      throw new BadRequestException(
        reviewMessages.error.youCannotRateWithoutUsingService,
      );
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
    const { userId } = body;
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

  async deleteReview(id: string) {
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

  async getReviewsOfServiceProvider(userId: string) {
    const reviewLists = await this.reviewModel.find({ userId });
    if (reviewLists.length) {
      const detailsResponse = await Promise.all(
        reviewLists.map(async (item) => {
          const userDetails = await this.userModel.findById(item.customerId);
          return {
            ...item.toJSON(),
            userPhoto: userDetails.profilePhoto,
            userName: userDetails.name,
          };
        }),
      );
      return detailsResponse;
    }
    return reviewLists;
  }

  async getReviewsGivenByUser(req: decodedRequest) {
    const customerId = req.user.id;
    const reviewGivenByUser = await this.reviewModel.find({ customerId });
    if (reviewGivenByUser.length) {
      const detailsResponse = await Promise.all(
        reviewGivenByUser.map(async (item) => {
          const serviceProviderDetails = await this.userModel.findById(
            item.userId,
          );
          return {
            ...item.toJSON(),
            serviceProvidePhoto: serviceProviderDetails.profilePhoto,
            serviceProviderName: serviceProviderDetails.name,
          };
        }),
      );
      return detailsResponse;
    }
    return reviewGivenByUser;
  }
}
