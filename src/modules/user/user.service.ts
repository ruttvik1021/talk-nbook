import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDTO } from 'src/dtos/userDto';
import { decodedRequest } from 'src/middlewares/token-validator-middleware';
import { USER_MODEL, UserDocument } from 'src/schemas/user-schema';
import { userMessages } from 'src/utils/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
  ) {}
  async getProfile(req: decodedRequest) {
    const userDetails = await this.userModel.findOne({ email: req.user.email });
    if (!userDetails)
      throw new BadRequestException(userMessages.errors.noUserFound);
    // userDetails.profilePic = byteArrayToBase64(userDetails.profilePic);
    return userDetails;
  }

  async updateProfile(req: decodedRequest, body: UpdateUserDTO) {
    const userByToken = await this.userModel.findOne({
      email: req.user.email,
    });
    if (!userByToken)
      throw new BadRequestException(userMessages.errors.noUserFound);
    if (userByToken.email !== body.email) {
      throw new BadRequestException(userMessages.errors.emailCannotBeUpdated);
    }
    // const bufferImage = base64ToByteArray(body.profilePic);
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email: req.user.email },
      { ...body, isProfileComplete: true },
      { returnOriginal: false },
    );
    if (!updatedUser)
      throw new BadRequestException(userMessages.errors.errorWhileSavingUser);
    return {
      message: userMessages.messages.userUpdated,
    };
  }

  async getAllServiceProviders() {
    const users = await this.userModel.find({ isServiceProvider: true });
    return users;
  }
  async getAllUsersList() {
    const users = await this.userModel.find();
    return users;
  }
}
