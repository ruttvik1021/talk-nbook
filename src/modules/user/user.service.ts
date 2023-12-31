import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PaginationDTO } from 'src/dtos/masterDto';
import { GetUserBySpecilizationDTO, UpdateUserDTO } from 'src/dtos/userDto';
import { decodedRequest } from 'src/middlewares/token-validator-middleware';
import {
  REVIEWS_MODEL,
  ReviewsDocument,
} from 'src/schemas/reviews-reports-schema';
import { USER_MODEL, UserDocument } from 'src/schemas/user-schema';
import { userMessages } from 'src/utils/constants';
import { RoleEnums } from 'src/utils/enums';
import { validateImageSize } from 'src/utils/validators/image-size-validation';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
    @InjectModel(REVIEWS_MODEL)
    private readonly reviewModel: Model<ReviewsDocument>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private calculateAverageRating = (ratings: any, key: string) =>
    ratings.length === 0
      ? 0
      : ratings.reduce((sum, rating) => sum + rating[key], 0) / ratings.length;

  private async uploadProfilePhoto(
    photo: string,
    userEmail: string,
    userId: string,
  ) {
    const uploadedPhoto: UploadApiResponse | UploadApiErrorResponse =
      await this.cloudinaryService.uploadProfileImage(
        validateImageSize(photo),
        userEmail,
        userId,
      );

    return uploadedPhoto.secure_url;
  }

  private async uploadCertificatePhoto(
    photo: string,
    userEmail: string,
    index: number,
    userId: string,
  ) {
    const uploadedPhoto: UploadApiResponse | UploadApiErrorResponse =
      await this.cloudinaryService.uploadCertificateImage(
        validateImageSize(photo),
        userEmail,
        index,
        userId,
      );

    return uploadedPhoto.secure_url;
  }

  private async updateSpecializations(
    specializations: any,
    userEmail: string,
    userId: string,
  ) {
    return Promise.all(
      specializations.map(async (specialization) => ({
        ...specialization,
        certificates: await Promise.all(
          specialization.certificates.map(
            async (item: string, index: number) =>
              await this.uploadCertificatePhoto(item, userEmail, index, userId),
          ),
        ),
      })),
    );
  }

  async updateProfile(req: decodedRequest, body: UpdateUserDTO) {
    const userEmail = req.user.email;
    const userId = req.user.id;
    const mobileNumber = body.mobileNumber;
    const isMobileNumberUsed = await this.userModel.find({
      email: { $ne: userEmail },
      mobileNumber,
    });
    if (isMobileNumberUsed.length)
      throw new BadRequestException(
        userMessages.errors.mobileNumberAlreadyUsed,
      );

    const userByToken = await this.userModel.findOne({
      email: userEmail,
    });

    if (!userByToken) {
      throw new BadRequestException(userMessages.errors.noUserFound);
    }

    if (userByToken.email !== body.email) {
      throw new BadRequestException(userMessages.errors.emailCannotBeUpdated);
    }

    let uploadedProfilePhoto = '';
    if (body.profilePhoto) {
      uploadedProfilePhoto = await this.uploadProfilePhoto(
        body.profilePhoto,
        userEmail,
        userId,
      );
    }
    if (body.specializations.length && body.isServiceProvider) {
      const updatedSpecializationArray = await this.updateSpecializations(
        body.specializations,
        userEmail,
        userId,
      );
      body.specializations = updatedSpecializationArray;
    }
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email: userEmail },
      {
        ...body,
        isProfileComplete: true,
        profilePhoto: uploadedProfilePhoto,
        role: req.user.role,
      },
      { returnOriginal: false },
    );

    if (!updatedUser) {
      throw new BadRequestException(userMessages.errors.errorWhileSavingUser);
    }

    return {
      message: userMessages.messages.userUpdated,
    };
  }

  async getProfile(req: decodedRequest) {
    const userDetails = await this.userModel.findOne(
      { email: req.user.email },
      { role: 0, _id: 0 },
    );
    if (!userDetails)
      throw new BadRequestException(userMessages.errors.noUserFound);

    return userDetails;
  }

  async getAllServiceProviders(body: GetUserBySpecilizationDTO) {
    const { specializations, limit, offset } = body;

    const usersQuery = specializations.length
      ? {
          isServiceProvider: true,
          role: RoleEnums.USER,
          'specializations.specializationId': { $in: specializations },
        }
      : { isServiceProvider: true };

    const users = await this.userModel
      .find(usersQuery)
      .skip(offset)
      .limit(limit)
      .exec();

    const usersWithRatings = await Promise.all(
      users.map(async (user) => {
        const ratings = await this.reviewModel
          .find({ userId: user._id })
          .select('ratings')
          .exec();
        const averageRating = this.calculateAverageRating(ratings, 'ratings');

        return {
          ...user.toJSON(),
          averageRating: averageRating,
          totalReviews: ratings.length,
        };
      }),
    );

    return usersWithRatings;
  }

  async getAllUsersList(body: PaginationDTO) {
    const { limit, offset } = body;
    const users = await this.userModel
      .find(
        {
          role: RoleEnums.USER,
        },
        {
          name: 1,
          isProfileComplete: 1,
          isServiceProvider: 1,
          profilePhoto: 1,
          email: 1,
          id: 1,
          mobileNumber: 1,
          isActive: 1,
        },
      )
      .skip(offset)
      .limit(limit)
      .exec();

    const total = await this.userModel.countDocuments({ role: RoleEnums.USER });

    return { users, total };
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException(userMessages.errors.noUserFound);
    return user;
  }

  async deactivateUserById(id: string) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      {
        isActive: false,
      },
      { returnOriginal: false },
    );
    if (!user) throw new BadRequestException(userMessages.errors.noUserFound);
    return user;
  }
}
