import { IsString } from 'class-validator';

export class AddLanguageDTO {
  @IsString()
  language: string;
}
