import { IsMongoId } from 'class-validator';

export class BookingsDTO {
  @IsMongoId()
  id: string;
}
