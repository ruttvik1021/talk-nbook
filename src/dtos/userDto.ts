import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { userMessages } from 'src/utils/constants';
import { ArrayElementIsObjectId } from 'src/utils/validators/array-element-is-objectId-validator';
import { IsDateFormatValid } from 'src/utils/validators/date-format-validator';

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export class Specialization {
  @IsMongoId()
  @IsNotEmpty({ message: userMessages.errors.specializationIdRequired })
  specializationId: string;

  @ValidateIf((o) => (o.specializationId ? true : false))
  @IsArray()
  @ArrayMinSize(1, {
    message: userMessages.errors.certificateMustBeAtleastOne,
  })
  @ArrayMaxSize(3, {
    message: userMessages.errors.maximumCertificatedOnlyThree,
  })
  certificates: string[];
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
  @MaxLength(255, { message: userMessages.errors.maxLengthForAbout })
  about: string;

  @IsString()
  @IsDateFormatValid({
    message: userMessages.errors.dateFormatIncorrect,
  })
  dateOfBirth: string;

  @IsEnum(GENDER)
  gender: GENDER;

  @IsString()
  profilePhoto: string;

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
  @IsSpecializationIdUnique({
    message: userMessages.errors.dublicateSpecializationDetected,
  })
  @Type(() => Specialization)
  @ArrayMinSize(1, {
    message: userMessages.errors.specializationMustBeAtleastOne,
  })
  @ArrayMaxSize(2, {
    message: userMessages.errors.maximumSpecializationOnlyTwo,
  })
  specializations: Specialization[];

  @IsArray()
  @ArrayMinSize(1, {
    message: userMessages.errors.languagesMustBeAtleastOne,
  })
  @ArrayElementIsObjectId({ message: userMessages.errors.invalidIdInLanguages })
  @ArrayUnique({ message: userMessages.errors.dublicateLanguagesDetected })
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

function IsSpecializationIdUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string): void {
    registerDecorator({
      name: 'isSpecializationIdUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: Specialization[], args: any): boolean {
          const specializationIds = new Set<string>();

          for (const specialization of value) {
            if (specializationIds.has(specialization.specializationId)) {
              return false; // Validation failed, specializationId is not unique
            }

            specializationIds.add(specialization.specializationId);
          }

          return true; // Validation passed, specializationId is unique for all elements
        },
      },
    });
  };
}
