import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER_MODEL, UserDocument } from 'src/schemas/user-schema';

@Injectable()
export class ServiceProviderGuard implements CanActivate {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
  ) {}

  async getUser(request: any) {
    const userDetails = await this.userModel.findOne({
      email: request.user.email,
    });
    return userDetails.isServiceProvider;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isServiceProvider = await this.getUser(request);

    if (isServiceProvider === true) {
      return true;
    }

    throw new UnauthorizedException();
  }
}
