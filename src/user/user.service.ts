import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { otpMessages, userMessages } from 'src/constants';
import { UpdateUserDTO } from 'src/dtos/userDto';
import { decodedRequest } from 'src/middlewares/token-validator-middleware';
import { USER_MODEL, UserDocument } from 'src/schemas/user-schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
  ) {}
  async getProfile(req: decodedRequest) {
    const userDetails = await this.userModel.findOne(
      { email: req.user.email },
      { id: 0 },
    );
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
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email: req.user.email },
      { ...body },
      { returnOriginal: false },
    );
    return {
      message: userMessages.messages.userUpdated,
    };
  }
}
