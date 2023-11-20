import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isNotEmpty,
  isString,
  registerDecorator,
} from 'class-validator';
import { Types } from 'mongoose';
import { userMessages } from 'src/constants';

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
  specializationId: string;
  certificates: Certifications[];
}

@ValidatorConstraint({ name: 'arrayElementIsObjectId', async: false })
export class ArrayElementIsObjectIdConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    if (!isNotEmpty(value) || !Array.isArray(value)) {
      return false;
    }

    return value.every(
      (element) => isString(element) && Types.ObjectId.isValid(element),
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `$property must be an array where each element is a valid ObjectId`;
  }
}

export function ArrayElementIsObjectId(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ArrayElementIsObjectIdConstraint,
    });
  };
}

export class UpdateUserDTO {
  @IsEmail({}, { message: userMessages.errors.emailMustBeValid })
  email: string;

  @IsNumberString()
  @MinLength(10, { message: userMessages.errors.mobileNumberMustBe10Digits })
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
