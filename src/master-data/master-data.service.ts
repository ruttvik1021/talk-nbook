import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { languagesMessages } from 'src/constants';
import { AddLanguageDTO } from 'src/dtos/addLanguageDto';
import { LANGUAGE_MODEL, LanguageDocument } from 'src/schemas/language-schema';

@Injectable()
export class MasterDataService {
  constructor(
    @InjectModel(LANGUAGE_MODEL)
    private readonly languageModel: Model<LanguageDocument>,
  ) {}
  async addNewLanguage(body: { language: string; isActive?: boolean }) {
    const language = await this.languageModel.findOne({
      language: body.language,
    });
    if (language) {
      throw new BadRequestException(languagesMessages.errors.languageExist);
    }

    const newLanguage = await this.languageModel.create({
      language: body.language,
    });
    if (!newLanguage) {
      throw new BadRequestException(
        languagesMessages.errors.errorWhileAddingLanguage,
      );
    }

    return {
      message: languagesMessages.messages.addedSuccessfully,
      data: newLanguage,
    };
  }

  async getAllLanguages() {
    const languages = await this.languageModel.find(
      {},
      { language: 1, _id: 0, id: '$_id' },
    );
    return languages;
  }
}
