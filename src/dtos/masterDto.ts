import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { languagesMessages, specializationMessages } from 'src/utils/constants';

export class AddLanguageDTO {
  @IsNotEmpty()
  @IsString()
  @Matches(/\S/, { message: languagesMessages.errors.mustNotBeEmpty })
  language: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  preffered: boolean;

  @IsOptional()
  @IsMongoId()
  id: string;
}

export class AddSpecializationDTO {
  @IsNotEmpty()
  @IsString()
  @Matches(/\S/, { message: specializationMessages.errors.mustNotBeEmpty })
  specialization: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  preffered: boolean;

  @IsOptional()
  @IsMongoId()
  id: string;
}

export class PaginationDTO {
  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsNumber()
  offset: number;
}
