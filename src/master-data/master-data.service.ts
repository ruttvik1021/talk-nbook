import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { categoryMessages, languagesMessages } from 'src/constants';
import {
  CATEGORY_MODEL,
  CategoryDocument,
} from 'src/schemas/categories-schema';
import { LANGUAGE_MODEL, LanguageDocument } from 'src/schemas/language-schema';
import { Request } from 'express';
import { decodedRequest } from 'src/middlewares/token-validator-middleware';
import { RoleEnums } from 'src/enums';
import { USER_MODEL, UserDocument } from 'src/schemas/user-schema';

@Injectable()
export class MasterDataService {
  constructor(
    @InjectModel(LANGUAGE_MODEL)
    private readonly languageModel: Model<LanguageDocument>,

    @InjectModel(CATEGORY_MODEL)
    private readonly categoryModel: Model<CategoryDocument>,

    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
  ) {}

  async getAllLanguages(req: decodedRequest) {
    const isSuperAdmin = req.user.role === RoleEnums.SUPERADMIN;
    const query = isSuperAdmin ? {} : { isActive: true };
    const languages = await this.languageModel.find(query);
    return languages;
  }

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

  async updateLanguage(
    body: { language: string; isActive?: boolean },
    id: string,
  ) {
    const existingDoc = await this.languageModel.findById(id);
    if (!existingDoc) throw new BadRequestException(languagesMessages.errors.languageNotFound);
    const usersHavingLanguage = await this.userModel.find({
      languages: { $in: [id] },
    });
    if (usersHavingLanguage.length && body.language !== existingDoc.language) {
      throw new BadRequestException(languagesMessages.errors.usedByUser);
    }

    const updatedLanguage = await this.languageModel.findByIdAndUpdate(
      { _id: id },
      { ...body },
      { returnOriginal: false },
    );
    if (!updatedLanguage)
      throw new BadRequestException(languagesMessages.errors.errorWhileUpdatingLanguage);
    return {
      message: languagesMessages.messages.updatedSuccessfully,
      data: updatedLanguage,
    };
  }

  async deleteLanguage(id: string) {
    const usersHavingLanguage = await this.userModel.find({
      languages: { $in: [id] },
    });
    if (usersHavingLanguage.length) {
      const updatedLanguage = await this.languageModel.findByIdAndUpdate(
        { _id: id },
        { $set: { isActive: false } },
        { returnOriginal: false },
      );
      if (!updatedLanguage)
        throw new BadRequestException(languagesMessages.errors.errorWhileUpdatingLanguage);
      return {
        message: languagesMessages.messages.languageUsedDeactivatedLanguage,
        data: updatedLanguage,
      };
    }

    const deleteLangauge = await this.languageModel.findByIdAndDelete(id);
    if (!deleteLangauge)
      throw new BadRequestException(languagesMessages.errors.errorWhileDeletingLanguage);
    return {
      message: languagesMessages.messages.deletedSuccessfully,
    };
  }

  async getAllCategories(req: decodedRequest) {
    const isSuperAdmin = req.user.role === RoleEnums.SUPERADMIN;
    const query = isSuperAdmin ? {} : { isActive: true };
    const categories = this.categoryModel.find({ query });
    return categories;
  }

  async addNewCategory({ category }: { category: string }) {
    const isPresent = await this.categoryModel.findOne({ category });
    if (isPresent)
      throw new BadRequestException(categoryMessages.errors.categoryExist);

    const newCategory = await this.categoryModel.create({
      category: category,
    });
    if (!newCategory) {
      throw new BadRequestException(
        categoryMessages.errors.errorWhileAddingCategory,
      );
    }
    return {
      message: categoryMessages.messages.addedSuccessfully,
      data: newCategory,
    };
  }
}
