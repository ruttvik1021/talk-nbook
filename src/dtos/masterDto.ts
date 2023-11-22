import {
  IsBoolean,
  IsNotEmpty,
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
}
