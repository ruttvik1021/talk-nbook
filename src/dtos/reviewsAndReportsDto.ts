import { IsMongoId, IsNumber, IsString, MaxLength } from 'class-validator';
import { reviewMessages } from 'src/utils/constants';

export class ReviewsDTO {
  @IsMongoId()
  userId: string;

  @IsNumber()
  ratings: number;

  @IsString()
  @MaxLength(250, {
    message: reviewMessages.error.reviewMustBeBelow250Characters,
  })
  review: string;
}
