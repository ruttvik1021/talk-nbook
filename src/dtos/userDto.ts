import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
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
  @IsString()
  name: string;

  @IsString()
  photoType: string;

  @IsString()
  photo: string;
}

class Specialization {
  @IsString()
  specializationId: string;

  @IsArray()
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

  @IsString()
  profilePicType: string;

  @IsString()
  profilePic: string;

  @IsArray()
  @ArrayElementIsObjectId({
    message: userMessages.errors.invalidIdInPreferences,
  })
  preferences: string[];

  @IsBoolean()
  isServiceProvider: boolean;

  @ValidateIf((o) => o.isServiceProvider === true)
  @IsBoolean()
  onSiteService: boolean;

  @IsArray()
  @ValidateIf((o) => o.isServiceProvider === true)
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
