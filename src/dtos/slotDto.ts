import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsMongoId,
  IsString,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { slotMessages } from 'src/utils/constants';
import { BookingStatus } from 'src/utils/enums';

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
class UpdateTimeSlotDto {
  @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
    message: slotMessages.errors.slotTimeInvalid,
  })
  from: Date;

  @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
    message: slotMessages.errors.slotTimeInvalid,
  })
  to: Date;

  @IsString()
  status: BookingStatus;
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
export class UpdateSlotDTO {
  @IsDateString()
  date: Date;

  @ValidateIf((o) => (o.date ? true : false))
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateTimeSlotDto)
  slots?: UpdateTimeSlotDto[];

  @IsMongoId()
  id: string;
}

export class BookSlotDTO {
  @IsString()
  slotDateId: string;

  @IsString()
  slotTimeId: string;

  @IsMongoId()
  userId: string;
}
