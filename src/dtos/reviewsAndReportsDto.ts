import { IsMongoId, IsNumber, IsString, Max, MaxLength } from 'class-validator';
import { reviewMessages } from 'src/utils/constants';

export class ReviewsDTO {
  @IsMongoId()
  userId: string;

  @IsNumber()
  @Max(5, {
    message: reviewMessages.error.ratingMustBeBetweenZeroAndFive,
  })
  ratings: number;

  @IsString()
  @MaxLength(250, {
    message: reviewMessages.error.reviewMustBeBelow250Characters,
  })
  review: string;
}
