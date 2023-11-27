import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookSlotDTO } from 'src/dtos/slotDto';
import { decodedRequest } from 'src/middlewares/token-validator-middleware';
import {
  BookingStatus,
  SLOTSBOOKING_MODEL,
  SLOTS_MODEL,
  SlotBookingsDocument,
  SlotsDocument,
} from 'src/schemas/slots-schema';
import { USER_MODEL, UserDocument } from 'src/schemas/user-schema';
import { slotMessages, userMessages } from 'src/utils/constants';

@Injectable()
export class BookslotsService {
  constructor(
    @InjectModel(SLOTSBOOKING_MODEL)
    private readonly slotBookingModel: Model<SlotBookingsDocument>,

    @InjectModel(USER_MODEL)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(SLOTS_MODEL) private readonly slotModel: Model<SlotsDocument>,
  ) {}

  async bookSlot(req: decodedRequest, body: BookSlotDTO) {
    const { userId, date, slot } = body;
    const userDetails = await this.userModel.findById(userId);
    if (!userDetails)
      throw new BadRequestException(userMessages.errors.noUserFound);

    const isSlotsAvailableOnThisDate = await this.slotModel.findOne({
      userId: userId,
      date: date,
    });

    if (!isSlotsAvailableOnThisDate || !isSlotsAvailableOnThisDate.slots.length)
      throw new BadRequestException(
        slotMessages.errors.noSlotsOnTheSelectedDate,
      );

    const arrayWithDateObjects = isSlotsAvailableOnThisDate.slots.map(
      (item) => ({
        ...item,
        from: new Date(`2000-01-01T${item.from}`),
        to: new Date(`2000-01-01T${item.to}`),
      }),
    );

    const receivedObjectWithDate = {
      ...slot,
      from: new Date(`2000-01-01T${slot.from}`),
      to: new Date(`2000-01-01T${slot.to}`),
    };

    const isDateValid = arrayWithDateObjects.some(
      (item) =>
        item.from.getTime() === receivedObjectWithDate.from.getTime() &&
        item.to.getTime() === receivedObjectWithDate.to.getTime(),
    );

    if (!isDateValid)
      throw new BadRequestException(
        slotMessages.errors.noSlotsOnTheSelectedDate,
      );

    const filter = {
      userId,
      date,
      'slots.from': slot.from,
      'slots.to': slot.to,
      'slots.status': BookingStatus.VACANT,
    };

    const update = {
      $set: {
        'slots.$.status': BookingStatus.LAPSED,
        'slots.$.customerId': req.user.id,
      },
    };

    const result = await this.slotModel.findOneAndUpdate(filter, update, {
      new: true,
    });

    if (!result)
      throw new BadRequestException(
        slotMessages.errors.errorWhileBookingSlotOrMightGotBooked,
      );

    return result;
  }
}
