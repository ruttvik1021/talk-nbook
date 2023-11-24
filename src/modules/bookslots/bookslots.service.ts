import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SlotBookingsDTO } from 'src/dtos/slotDto';
import { decodedRequest } from 'src/middlewares/token-validator-middleware';
import {
  SLOTSBOOKING_MODEL,
  SlotBookingsDocument,
} from 'src/schemas/slots-schema';
import { USER_MODEL, UserDocument } from 'src/schemas/user-schema';
import { slotMessages } from 'src/utils/constants';

@Injectable()
export class BookslotsService {
  constructor(
    @InjectModel(SLOTSBOOKING_MODEL)
    private readonly slotBookingModel: Model<SlotBookingsDocument>,

    @InjectModel(USER_MODEL)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async bookSlot(req: decodedRequest, body: SlotBookingsDTO) {
    const user = await this.userModel.findOne({ email: req.user.email });
    const slotBooking = await this.slotBookingModel.create({
      ...body,
      customerId: user.id,
    });
    if (!slotBooking)
      throw new BadRequestException(slotMessages.errors.errorWhileBookingSlot);
    return {
      message: slotMessages.messages.slotBooked,
      data: slotBooking,
    };
  }
}
