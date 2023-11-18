import { Module } from '@nestjs/common';
import { MasterDataController } from './master-data.controller';
import { MasterDataService } from './master-data.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LANGUAGE_MODEL, LanguageSchema } from 'src/schemas/language-schema';
import { CATEGORY_MODEL, CategorySchema } from 'src/schemas/categories-schema';
import { USER_MODEL, UserSchema } from 'src/schemas/user-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: LANGUAGE_MODEL,
        schema: LanguageSchema,
      },
      {
        name: CATEGORY_MODEL,
        schema: CategorySchema,
      },
      { name: USER_MODEL, schema: UserSchema },
    ]),
  ],
  controllers: [MasterDataController],
  providers: [MasterDataService],
})
export class MasterDataModule {}
