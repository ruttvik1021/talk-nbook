import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
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

  @IsOptional()
  @IsString()
  id: string;
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

export class SlotBookingsDTO {
  @IsArray()
  @ArrayMinSize(1, {
    message: slotMessages.errors.atleastOneSlotRequired,
  })
  bookSlots: SlotDTO[];
}
