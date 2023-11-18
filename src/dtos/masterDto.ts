import { IsBoolean, IsString } from 'class-validator';

export class AddLanguageDTO {
  @IsString()
  language: string;

  @IsBoolean()
  isActive?: boolean;
}

export class AddCategoryDTO {
  @IsString()
  category: string;

  @IsBoolean()
  isActive?: boolean;
}
