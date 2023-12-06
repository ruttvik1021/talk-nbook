import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsMongoId,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { slotMessages } from 'src/utils/constants';
import { BookingStatus } from 'src/utils/enums';

class TimeSlotDto {
  @IsDateString({}, { message: slotMessages.errors.slotTimeInvalid })
  from: Date;

  @IsDateString({}, { message: slotMessages.errors.slotTimeInvalid })
  to: Date;
}
class UpdateTimeSlotDto {
  @IsDateString({}, { message: slotMessages.errors.slotTimeInvalid })
  from: Date;

  @IsDateString({}, { message: slotMessages.errors.slotTimeInvalid })
  to: Date;

  @IsString()
  status: BookingStatus;
}

export class SlotDTO {
  @IsDateString({}, { message: slotMessages.errors.slotTimeInvalid })
  date: Date;

  @ValidateIf((o) => (o.date ? true : false))
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  slots?: TimeSlotDto[];
}
export class UpdateSlotDTO {
  @IsDateString({}, { message: slotMessages.errors.slotTimeInvalid })
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
