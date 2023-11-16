import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumberString,
  IsString,
} from 'class-validator';
import { userMessages } from 'src/constants';

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

class CERTIFICATIONS {
  @IsString()
  name: string;

  @IsString()
  photoType: string;

  @IsString()
  photo: string;
}

export class createUserDTO {
  @IsEmail({}, { message: userMessages.errors.EMAIL_MUST_BE_VALID })
  email: string;
}

export class updateUserDTO {
  @IsEmail({}, { message: userMessages.errors.EMAIL_MUST_BE_VALID })
  email: string;

  @IsNumberString()
  mobileNumber: string;

  @IsString()
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
  preferences: string[];

  @IsArray()
  certificates: CERTIFICATIONS[];

  @IsArray()
  languages: string[];
}
