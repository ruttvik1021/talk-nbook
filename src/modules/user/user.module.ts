import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODEL, UserSchema } from 'src/schemas/user-schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import {
  REVIEWS_MODEL,
  ReviewsSchema,
} from 'src/schemas/reviews-reports-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODEL, schema: UserSchema },
      { name: REVIEWS_MODEL, schema: ReviewsSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
