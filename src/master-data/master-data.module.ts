import { Module } from '@nestjs/common';
import { MasterDataController } from './master-data.controller';
import { MasterDataService } from './master-data.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LANGUAGE_MODEL, LanguageSchema } from 'src/schemas/language-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: LANGUAGE_MODEL,
        schema: LanguageSchema,
      },
    ]),
  ],
  controllers: [MasterDataController],
  providers: [MasterDataService],
})
export class MasterDataModule {}
