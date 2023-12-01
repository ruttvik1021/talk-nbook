import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PaginationDTO } from 'src/dtos/masterDto';
import {
  Certifications,
  GetUserBySpecilizationDTO,
  Specialization,
  UpdateUserDTO,
} from 'src/dtos/userDto';
import { decodedRequest } from 'src/middlewares/token-validator-middleware';
import { USER_MODEL, UserDocument } from 'src/schemas/user-schema';
import { userMessages } from 'src/utils/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private async uploadProfilePhoto(
    photo: string,
    userEmail: string,
    userId: string,
  ) {
    const uploadedPhoto: UploadApiResponse | UploadApiErrorResponse =
      await this.cloudinaryService.uploadProfileImage(photo, userEmail, userId);

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
        photo,
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
            async (item: Certifications, index: number) => ({
              ...item,
              photo: await this.uploadCertificatePhoto(
                item.photo,
                userEmail,
                index,
                userId,
              ),
            }),
          ),
        ),
      })),
    );
  }

  async updateProfile(req: decodedRequest, body: UpdateUserDTO) {
    const userEmail = req.user.email;
    const userId = req.user.id;

    // Ensure the user exists
    const userByToken = await this.userModel.findOne({
      email: userEmail,
    });

    if (!userByToken) {
      throw new BadRequestException(userMessages.errors.noUserFound);
    }

    if (userByToken.email !== body.email) {
      throw new BadRequestException(userMessages.errors.emailCannotBeUpdated);
    }

    // Upload profile photo
    const uploadedProfilePhoto = await this.uploadProfilePhoto(
      body.profilePhoto,
      userEmail,
      userId,
    );

    // Update specializations
    if (body.specializations.length) {
      const updatedSpecializationArray = await this.updateSpecializations(
        body.specializations,
        userEmail,
        userId,
      );
      body.specializations = updatedSpecializationArray;
    }

    // Update user profile in MongoDB
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email: userEmail },
      {
        ...body,
        isProfileComplete: true,
        profilePhoto: uploadedProfilePhoto,
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
    const userDetails = await this.userModel.findOne({ email: req.user.email });
    if (!userDetails)
      throw new BadRequestException(userMessages.errors.noUserFound);
    return userDetails;
  }

  async getAllServiceProviders(body: GetUserBySpecilizationDTO) {
    const { specializations, limit, offset } = body;
    if (specializations.length) {
      const users = await this.userModel
        .find({
          isServiceProvider: true,
          'specializations.specializationId': { $in: specializations },
        })
        .skip(offset)
        .limit(limit)
        .exec();
      return users;
    } else {
      const users = await this.userModel
        .find({ isServiceProvider: true })
        .skip(offset)
        .limit(limit);
      return users;
    }
  }

  async getAllUsersList(body: PaginationDTO) {
    const { limit, offset } = body;
    const users = await this.userModel.find().skip(offset).limit(limit);
    return users;
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException(userMessages.errors.noUserFound);
    return user;
  }
}
