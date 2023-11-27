import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsMongoId,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { slotMessages } from 'src/utils/constants';

class TimeSlotDto {
  @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
    message: slotMessages.errors.slotTimeInvalid,
  })
  from: Date;

  @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
    message: slotMessages.errors.slotTimeInvalid,
  })
  to: Date;
}

export class SlotDTO {
  @IsDateString()
  date: Date;

  @ValidateIf((o) => (o.date ? true : false))
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  slots?: TimeSlotDto[];
}

export class BookSlotDTO {
  @IsMongoId()
  userId: string;

  @IsDateString()
  date: Date;

  @ValidateIf((o) => (o.date ? true : false))
  slot: TimeSlotDto;
}
