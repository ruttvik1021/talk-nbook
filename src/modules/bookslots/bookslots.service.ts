import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SlotBookingsDTO } from 'src/dtos/slotDto';
import { decodedRequest } from 'src/middlewares/token-validator-middleware';
import {
  SLOTSBOOKING_MODEL,
  SLOTS_MODEL,
  SlotBookingsDocument,
  SlotsDocument,
} from 'src/schemas/slots-schema';
import { USER_MODEL, UserDocument } from 'src/schemas/user-schema';

@Injectable()
export class BookslotsService {
  constructor(
    @InjectModel(SLOTSBOOKING_MODEL)
    private readonly slotBookingModel: Model<SlotBookingsDocument>,

    @InjectModel(USER_MODEL)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(SLOTS_MODEL) private readonly slotModel: Model<SlotsDocument>,
  ) {}

  async bookSlot(req: decodedRequest, body: SlotBookingsDTO, userId: string) {
    return { ...body, userId };
    // const { bookSlots } = body;
    // const slotBookingStatusArray = [];
    // for (let i = 0; i < bookSlots.length; i++) {
    //   const getSlotDetails = await this.slotModel.findOne({
    //     userId: userId,
    //     date: bookSlots[i].date,
    //   });
    //   if (!getSlotDetails) return slotBookingStatusArray.push(false);
    //   const isSlotAvailable = getSlotDetails.slots.find(
    //     (item: any) =>
    //       JSON.stringify(item) === JSON.stringify(bookSlots[i].slots),
    //   );
    // }
    // return slotBookingStatusArray;
    // const slotByUser = await this.slotModel.find({ userId: userId, date: body.bookSlots });
    // return slotByUser;
    // const user = await this.userModel.findOne({ email: req.user.email });
    // const slotBooking = await this.slotBookingModel.create({
    //   ...body,
    //   customerId: user.id,
    // });
    // if (!slotBooking)
    //   throw new BadRequestException(slotMessages.errors.errorWhileBookingSlot);
    // return {
    //   message: slotMessages.messages.slotBooked,
    //   data: slotBooking,
    // };
  }
}
