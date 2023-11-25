import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { userMessages } from 'src/utils/constants';
import { ArrayElementIsObjectId } from 'src/utils/validators/array-element-is-objectId-validator';
import { IsDateFormatValid } from 'src/utils/validators/date-format-validator';

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

class Certifications {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  photoType: string;

  @IsNotEmpty()
  photo: string;
}

class Specialization {
  @IsNotEmpty({ message: userMessages.errors.specializationIdRequired })
  specializationId: string;

  @ValidateIf((o) => (o.specializationId ? true : false))
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Certifications)
  @ArrayMinSize(1, {
    message: userMessages.errors.certificateMustBeAtleastOne,
  })
  certificates: Certifications[];
}

export class UpdateUserDTO {
  @IsEmail({}, { message: userMessages.errors.emailMustBeValid })
  email: string;

  @IsString()
  @Matches(/^\+\d{1,}-\d+$/, { message: userMessages.errors.mustBeInPattern })
  mobileNumber: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  role: string;

  @IsString()
  @MaxLength(255, { message: userMessages.errors.maxLengthForAbout })
  about: string;

  @IsString()
  @IsDateFormatValid({
    message: `Date of birth ${userMessages.errors.dateFormatIncorrect}`,
  })
  dateOfBirth: string;

  @IsEnum(GENDER)
  gender: GENDER;

  @IsOptional()
  @IsString()
  profilePicType: string;

  @IsOptional()
  @IsString()
  profilePic: string;

  @IsArray()
  @ArrayElementIsObjectId({
    message: userMessages.errors.invalidIdInPreferences,
  })
  prefferedSpecializations: string[];

  @IsBoolean()
  isServiceProvider: boolean;

  @ValidateIf((o) => o.isServiceProvider === true)
  @IsBoolean()
  onSiteService: boolean;

  @ValidateIf((o) => o.onSiteService === true)
  @IsArray()
  @ArrayMinSize(1, { message: userMessages.errors.locationMustBeAtleastOne })
  @MaxLength(50, { each: true, message: userMessages.errors.locationLength })
  locations: string[];

  @ValidateIf((o) => o.isServiceProvider === true)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Specialization)
  @ArrayMinSize(1, {
    message: userMessages.errors.specializationMustBeAtleastOne,
  })
  specializations: Specialization[];

  @IsArray()
  @ArrayMinSize(1, {
    message: userMessages.errors.languagesMustBeAtleastOne,
  })
  @ArrayElementIsObjectId({ message: userMessages.errors.invalidIdInLanguages })
  languages: string[];
}

export class GetUserBySpecilizationDTO {
  @IsArray()
  @ArrayElementIsObjectId({
    message: userMessages.errors.invalidIdInPreferences,
  })
  specializations: string[];

  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsNumber()
  offset: number;
}
