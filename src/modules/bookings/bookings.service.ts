import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { decodedRequest } from 'src/middlewares/token-validator-middleware';
import {
  BOOKINGDETAILS_MODEL,
  BookingDetailsDocument,
} from 'src/schemas/booking-details-schema';
import { SLOTS_MODEL, SlotsDocument } from 'src/schemas/slots-schema';
import { USER_MODEL, UserDocument } from 'src/schemas/user-schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(BOOKINGDETAILS_MODEL)
    private readonly bookingsModel: Model<BookingDetailsDocument>,

    @InjectModel(USER_MODEL)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(SLOTS_MODEL) private readonly slotsModel: Model<SlotsDocument>,
  ) {}

  private async getBookingDetails(item: BookingDetailsDocument) {
    const { id, customerId, userId, slotDateId, slotTimeId } = item;
    const customerDetails = await this.userModel.findById(customerId);
    const serviceProviderDetails = await this.userModel.findById(userId);
    const bookingDetails = await this.slotsModel.findById(slotDateId);

    console.log({ id, customerId, userId, slotDateId, slotTimeId });

    const bookingTime = bookingDetails.slots.find((item) =>
      new ObjectId(item.id).equals(new ObjectId(slotTimeId)),
    );

    const response = {
      id,
      bookedBy: customerDetails.name,
      bookedAgainst: serviceProviderDetails.name,
      bookingDate: bookingDetails.date,
      bookingTimeFrom: bookingTime.from,
      bookingTimeTo: bookingTime.to,
      customerId,
      userId,
      slotDateId,
      slotTimeId,
    };
    return response;
  }

  async getMyBookings(req: decodedRequest) {
    const bookings = await this.bookingsModel.find({ userId: req.user.id });
    if (!bookings.length) return [];
    const detailsResponse = await Promise.all(
      bookings.map(async (item) => {
        return await this.getBookingDetails(item);
      }),
    );
    return detailsResponse;
  }
  async getMyAppointments(req: decodedRequest) {
    const appointments = await this.bookingsModel.find({
      customerId: req.user.id,
    });
    if (!appointments.length) return [];
    const appointmentLists = await Promise.all(
      appointments.map(async (item) => {
        return await this.getBookingDetails(item);
      }),
    );
    return appointmentLists;
  }
}
