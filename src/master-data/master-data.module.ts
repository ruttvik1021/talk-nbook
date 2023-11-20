import { Module } from '@nestjs/common';
import { MasterDataController } from './master-data.controller';
import { MasterDataService } from './master-data.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LANGUAGE_MODEL, LanguageSchema } from 'src/schemas/language-schema';
import {
  SPECIALIZATION_MODEL,
  SpecializationSchema,
} from 'src/schemas/categories-schema';
import { USER_MODEL, UserSchema } from 'src/schemas/user-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: LANGUAGE_MODEL,
        schema: LanguageSchema,
      },
      {
        name: SPECIALIZATION_MODEL,
        schema: SpecializationSchema,
      },
      { name: USER_MODEL, schema: UserSchema },
    ]),
  ],
  controllers: [MasterDataController],
  providers: [MasterDataService],
})
export class MasterDataModule {}
