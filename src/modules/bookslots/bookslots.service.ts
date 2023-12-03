import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { BookingsDTO } from 'src/dtos/bookingsDTO';
import { BookSlotDTO } from 'src/dtos/slotDto';
import { decodedRequest } from 'src/middlewares/token-validator-middleware';
import {
  BOOKINGDETAILS_MODEL,
  BookingDetailsDocument,
} from 'src/schemas/booking-details-schema';
import { SLOTS_MODEL, SlotsDocument } from 'src/schemas/slots-schema';
import { USER_MODEL, UserDocument } from 'src/schemas/user-schema';
import { slotMessages, userMessages } from 'src/utils/constants';
import { BookingStatus } from 'src/utils/enums';
import { MailerService } from '../../mail/mail.service';

@Injectable()
export class BookslotsService {
  constructor(
    @InjectModel(USER_MODEL)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(SLOTS_MODEL) private readonly slotModel: Model<SlotsDocument>,
    @InjectModel(BOOKINGDETAILS_MODEL)
    private readonly bookingsModel: Model<BookingDetailsDocument>,

    private readonly mailerService: MailerService,
  ) {}

  async bookSlot(req: decodedRequest, body: BookSlotDTO) {
    const { id } = req.user;
    const { userId, slotTimeId, slotDateId } = body;
    const userDetails = await this.userModel.findById(userId);
    const customerDetails = await this.userModel.findById(id, { name: 1 });
    if (!userDetails)
      throw new BadRequestException(userMessages.errors.noUserFound);

    const dateSlot = await this.slotModel.findById(slotDateId);

    const timeSlotIndex = dateSlot?.slots?.findIndex((item: any) =>
      new ObjectId(item.id).equals(new ObjectId(slotTimeId)),
    );

    if (new Date(dateSlot.date) < new Date()) {
      const updatedSLots = dateSlot.slots.map((item, index) => {
        if (index === timeSlotIndex) {
          return {
            ...item,
            status: BookingStatus.EXPIRED,
          };
        }
        return item;
      });

      dateSlot.slots = updatedSLots;
      await this.slotModel.findByIdAndUpdate(slotDateId, dateSlot);
      throw new BadRequestException(slotMessages.errors.slotDateExpired);
    }

    if (
      dateSlot.slots[timeSlotIndex].status === BookingStatus.BOOKED ||
      dateSlot.slots[timeSlotIndex].status === BookingStatus.LAPSED
    )
      throw new BadRequestException(slotMessages.errors.oopsSlotBooked);

    if (!dateSlot || timeSlotIndex < 0)
      throw new BadRequestException(slotMessages.errors.noSlotFound);

    const updatedSLots = dateSlot.slots.map((item, index) => {
      if (index === timeSlotIndex) {
        return {
          ...item,
          status: BookingStatus.BOOKED,
          customerId: id,
        };
      }
      return item;
    });

    const addBooking = await this.bookingsModel.create({
      userId,
      customerId: id,
      userName: userDetails.name,
      customerName: customerDetails.name,
      slotTimeId,
      slotDateId,
      status: BookingStatus.BOOKED,
    });

    if (!addBooking)
      throw new BadRequestException(slotMessages.errors.errorWhileBookingSlot);

    dateSlot.slots = updatedSLots;
    const result = await this.slotModel.findByIdAndUpdate(slotDateId, dateSlot);

    if (!result)
      throw new BadRequestException(slotMessages.errors.errorWhileBookingSlot);

    this.mailerService.bookingStatus({
      bookingId: slotTimeId,
      date: new Date(dateSlot.date).toLocaleDateString(),
      serviceProviderName: userDetails.name,
      slotTimefrom: result.slots[timeSlotIndex].from,
      slotTimeto: result.slots[timeSlotIndex].to,
      subject: slotMessages.messages.slotBooked,
      userEmail: req.user.email,
      status: BookingStatus.BOOKED,
    });

    return { message: slotMessages.messages.slotBooked };
  }

  async cancelBooking(req: decodedRequest, body: BookingsDTO) {
    const tokenId = req.user.id;
    const { id } = body;
    const getBookingDetails = await this.bookingsModel.findById(id);
    if (!getBookingDetails)
      throw new BadRequestException(slotMessages.errors.noBookingFound);
    const { customerId, slotDateId, slotTimeId, userId } = getBookingDetails;

    if (!new ObjectId(tokenId).equals(new ObjectId(customerId)))
      throw new UnauthorizedException();

    const bookingDetails = await this.slotModel.findById(slotDateId);
    if (!bookingDetails)
      throw new BadRequestException(slotMessages.errors.noSlotFound);

    const slotIndex = bookingDetails.slots.findIndex((item) =>
      new ObjectId(item.id).equals(new ObjectId(slotTimeId)),
    );

    const compareTime =
      new Date() >
      new Date(
        `${bookingDetails.date.split('T')[0]}T${
          bookingDetails.slots[slotIndex].from
        }:00Z`,
      );

    if (compareTime)
      throw new BadRequestException(
        slotMessages.errors.slotTimingPassedYouCannotCancelTheSlot,
      );

    const updatedSLots = bookingDetails.slots.map((item, index) => {
      if (index === slotIndex) {
        return {
          ...item,
          status: BookingStatus.CANCELLED,
          customerId: '',
        };
      }
      return item;
    });

    const cancelBooking = await this.bookingsModel.findByIdAndUpdate(id, {
      $set: { status: BookingStatus.CANCELLED },
    });

    if (!cancelBooking)
      throw new BadRequestException(slotMessages.errors.errorWhileBookingSlot);

    bookingDetails.slots = updatedSLots;
    const result = await this.slotModel.findByIdAndUpdate(
      slotDateId,
      bookingDetails,
    );
    if (!result)
      throw new BadRequestException(
        slotMessages.errors.errorWhileCancellingSlot,
      );

    const userName = await this.userModel.findById(userId, { name: 1 });

    this.mailerService.bookingStatus({
      bookingId: slotTimeId,
      date: new Date(bookingDetails.date).toLocaleDateString(),
      serviceProviderName: userName.name,
      slotTimefrom: result.slots[slotIndex].from,
      slotTimeto: result.slots[slotIndex].to,
      subject: slotMessages.messages.slotBooked,
      userEmail: req.user.email,
      status: BookingStatus.CANCELLED,
    });

    return { message: slotMessages.messages.slotBookingCancelled };
  }
}
