import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { languagesMessages, specializationMessages } from 'src/utils/constants';
import {
  AddLanguageDTO,
  AddSpecializationDTO,
  PaginationDTO,
} from 'src/dtos/masterDto';
import { RoleEnums } from 'src/utils/enums';
import { decodedRequest } from 'src/middlewares/token-validator-middleware';
import {
  SPECIALIZATION_MODEL,
  SpecializationDocument,
} from 'src/schemas/categories-schema';
import { LANGUAGE_MODEL, LanguageDocument } from 'src/schemas/language-schema';
import { USER_MODEL, UserDocument } from 'src/schemas/user-schema';

@Injectable()
export class MasterDataService {
  constructor(
    @InjectModel(LANGUAGE_MODEL)
    private readonly languageModel: Model<LanguageDocument>,

    @InjectModel(SPECIALIZATION_MODEL)
    private readonly specializationModel: Model<SpecializationDocument>,

    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
  ) {}

  async getAllLanguages(req: decodedRequest) {
    const isSuperAdmin = req.user.role === RoleEnums.SUPERADMIN;
    const userLanguagePreferences = await this.userModel.findOne(
      {
        email: req.user.email,
      },
      { languages: 1 },
    );
    const query = isSuperAdmin ? {} : { isActive: true };
    const languages = await this.languageModel
      .find(query)
      .sort({ language: 1 });

    if (!isSuperAdmin && userLanguagePreferences.languages.length) {
      languages.forEach((item: any) => {
        item.preffered = userLanguagePreferences.languages.includes(item.id);
      });
    }

    return languages;
  }

  async addNewLanguage(body: AddLanguageDTO) {
    const language = await this.languageModel.findOne({
      language: body.language,
    });
    if (language) {
      throw new BadRequestException(languagesMessages.errors.languageExist);
    }

    const newLanguage = await this.languageModel.create({
      language: body.language,
      isActive: true,
      preffered: false,
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

  async updateLanguage(body: AddLanguageDTO, id: string) {
    const existingDoc = await this.languageModel.findById(id);
    if (!existingDoc)
      throw new BadRequestException(languagesMessages.errors.languageNotFound);
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
      throw new BadRequestException(
        languagesMessages.errors.errorWhileUpdatingLanguage,
      );
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
        throw new BadRequestException(
          languagesMessages.errors.errorWhileUpdatingLanguage,
        );
      return {
        message: languagesMessages.messages.languageUsedDeactivatedLanguage,
        data: updatedLanguage,
      };
    }

    const deleteLangauge = await this.languageModel.findByIdAndDelete(id);
    if (!deleteLangauge)
      throw new BadRequestException(
        languagesMessages.errors.errorWhileDeletingLanguage,
      );
    return {
      message: languagesMessages.messages.deletedSuccessfully,
    };
  }

  async getAllSpecializations(req: decodedRequest, body: PaginationDTO) {
    const isSuperAdmin = req.user.role === RoleEnums.SUPERADMIN;
    const { limit, offset } = body;
    const userSpecializationPreferences = await this.userModel.findOne(
      {
        email: req.user.email,
      },
      { prefferedSpecializations: 1 },
    );
    const query = isSuperAdmin ? {} : { isActive: true };
    const specializations = await this.specializationModel
      .find(query)
      .sort({ specialization: 1 })
      .limit(limit)
      .skip(offset);
    if (
      !isSuperAdmin &&
      userSpecializationPreferences.prefferedSpecializations.length
    ) {
      specializations.forEach((item) => {
        item.preffered =
          userSpecializationPreferences.prefferedSpecializations.includes(
            item.id,
          );
      });
      specializations.sort((a, b) => {
        if (a.preffered && !b.preffered) {
          return -1; // a comes before b
        } else if (!a.preffered && b.preffered) {
          return 1; // b comes before a
        } else {
          return 0; // order unchanged
        }
      });
    }

    const total = await this.specializationModel.countDocuments(query);

    return { total, specializations };
  }

  async addNewSpecialization(body: AddSpecializationDTO) {
    const isPresent = await this.specializationModel.findOne({
      specialization: body.specialization,
    });
    if (isPresent)
      throw new BadRequestException(
        specializationMessages.errors.specializationExist,
      );

    const newSpecialization = await this.specializationModel.create({
      specialization: body.specialization,
      isActive: true,
      preffered: false,
    });
    if (!newSpecialization) {
      throw new BadRequestException(
        specializationMessages.errors.specializationExist,
      );
    }
    return {
      message: specializationMessages.messages.addedSuccessfully,
      data: newSpecialization,
    };
  }

  async updateSpecialization(body: AddSpecializationDTO, id: string) {
    const existingDoc = await this.specializationModel.findById(id);
    if (!existingDoc)
      throw new BadRequestException(
        specializationMessages.errors.specializationExist,
      );
    const usersHavingLanguage = await this.userModel
      .find({
        specializations: { $elemMatch: { specializationId: id } },
      })
      .exec();
    if (
      usersHavingLanguage.length &&
      body.specialization !== existingDoc.specialization
    ) {
      throw new BadRequestException(specializationMessages.errors.usedByUser);
    }

    const updatedSpecialization =
      await this.specializationModel.findByIdAndUpdate(
        { _id: id },
        { ...body },
        { returnOriginal: false },
      );
    if (!updatedSpecialization)
      throw new BadRequestException(
        specializationMessages.errors.errorWhileUpdatingSpecialization,
      );
    return {
      message: specializationMessages.messages.updatedSuccessfully,
      data: updatedSpecialization,
    };
  }

  async deleteSpecialization(id: string) {
    const usersHavingSpecialization = await this.userModel
      .find({
        specializations: { $elemMatch: { specializationId: id } },
      })
      .exec();

    if (usersHavingSpecialization.length) {
      const updatedSpecialization =
        await this.specializationModel.findByIdAndUpdate(
          { _id: id },
          { $set: { isActive: false } },
          { returnOriginal: false },
        );
      if (!updatedSpecialization)
        throw new BadRequestException(
          specializationMessages.errors.errorWhileUpdatingSpecialization,
        );
      return {
        message:
          specializationMessages.messages.specializationUsedDeactivatedLanguage,
        data: updatedSpecialization,
      };
    }

    const deleteSpecialization =
      await this.specializationModel.findByIdAndDelete(id);
    if (!deleteSpecialization)
      throw new BadRequestException(
        specializationMessages.errors.errorWhileDeletingSpecialization,
      );
    return {
      message: specializationMessages.messages.deletedSuccessfully,
    };
  }
}
