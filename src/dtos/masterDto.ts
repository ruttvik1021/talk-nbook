import { IsBoolean, IsNotEmpty, IsString, Matches } from 'class-validator';
import { languagesMessages, specializationMessages } from 'src/constants';

export class AddLanguageDTO {
  @IsNotEmpty()
  @IsString()
  @Matches(/\S/, { message: languagesMessages.errors.mustNotBeEmpty })
  language: string;

  @IsBoolean()
  isActive?: boolean;
}

export class AddSpecializationDTO {
  @IsNotEmpty()
  @IsString()
  @Matches(/\S/, { message: specializationMessages.errors.mustNotBeEmpty })
  specialization: string;

  @IsBoolean()
  isActive?: boolean;
}
