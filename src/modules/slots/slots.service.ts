import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { SlotDTO, UpdateSlotDTO } from 'src/dtos/slotDto';
import { decodedRequest } from 'src/middlewares/token-validator-middleware';
import { SLOTS_MODEL, SlotsDocument } from 'src/schemas/slots-schema';
import { USER_MODEL, UserDocument } from 'src/schemas/user-schema';
import { slotMessages, userMessages } from 'src/utils/constants';
import { BookingStatus } from 'src/utils/enums';
import * as moment from 'moment';

@Injectable()
export class SlotsService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
    @InjectModel(SLOTS_MODEL) private readonly slotModel: Model<SlotsDocument>,
  ) {}

  private async findUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }, { id: 1 });
    if (!user) throw new BadRequestException(userMessages.errors.noUserFound);
    return user;
  }

  private overlapCheck(value: any): boolean {
    for (let i = 0; i < value.length; i++) {
      const fromValue = value[i].from;
      const toValue = value[i].to;
      if (!moment(fromValue).isBefore(moment(toValue))) {
        throw new BadRequestException(
          slotMessages.errors.toTimeMustBeGreaterThanFromTime,
        );
      }

      const currentInterval = value[i];
      const nextIntervals = value.slice(i + 1);

      for (const nextInterval of nextIntervals) {
        if (
          moment(currentInterval.from).isBefore(moment(nextInterval.to)) &&
          moment(currentInterval.to).isAfter(moment(nextInterval.from))
        ) {
          return false;
        }
      }
    }
    return true;
  }

  async createSlot(req: decodedRequest, body: SlotDTO) {
    const user = await this.findUserByEmail(req.user.email);

    const isSlotCreatedForTheDate = await this.slotModel.findOne({
      date: body.date,
      userId: user.id,
    });

    if (isSlotCreatedForTheDate)
      throw new BadRequestException(
        slotMessages.errors.slotsAlreadyCreatedForThisDateUpdateThisDate,
      );

    const earliestDate = moment.min(
      body.slots.map((slot) => moment(slot.from)),
    );

    // Check if the earliest date is after the given date
    const isAfter = earliestDate.isAfter(body.date);
    if (!isAfter)
      throw new BadRequestException(
        slotMessages.errors.slotMustBeAfterTheDateProvided,
      );

    const rangeStart = moment(body.date);
    const rangeEnd = moment(body.date).add(24, 'hours'); // Assuming a 24-hour range

    // Check if all slots are within the range
    const allSlotsWithinRange = body.slots.every((slot) => {
      const slotStart = moment(slot.from);
      const slotEnd = moment(slot.to);

      return (
        slotStart.isSameOrAfter(rangeStart) && slotEnd.isSameOrBefore(rangeEnd)
      );
    });

    if (!allSlotsWithinRange)
      throw new BadRequestException(
        slotMessages.errors.slotTimingsMustBeWithinADaysRange,
      );

    if (this.overlapCheck(body.slots)) {
      const defaultStatus = BookingStatus.VACANT;
      const defaultSlots = body.slots.map((slot) => ({
        ...slot,
        status: defaultStatus,
        id: new ObjectId(),
      }));

      const slot = await this.slotModel.create({
        ...body,
        slots: defaultSlots,
        userId: user.id,
      });
      return slot;
    }

    throw new BadRequestException(slotMessages.errors.datesOverLap);
  }

  async updateSlot(req: decodedRequest, body: UpdateSlotDTO) {
    const user = await this.findUserByEmail(req.user.email);

    const earliestDate = moment.min(
      body.slots.map((slot) => moment(slot.from)),
    );

    console.log('earliestDate', earliestDate);

    // Check if the earliest date is after the given date
    const isAfter = earliestDate.isAfter(body.date);
    if (!isAfter)
      throw new BadRequestException(
        slotMessages.errors.slotMustBeAfterTheDateProvided,
      );

    console.log('isAfter', isAfter);
    const rangeStart = moment(body.date);
    const rangeEnd = moment(body.date).add(24, 'hours'); // Assuming a 24-hour range

    // Check if all slots are within the range
    const allSlotsWithinRange = body.slots.every((slot) => {
      const slotStart = moment(slot.from);
      const slotEnd = moment(slot.to);

      return (
        slotStart.isSameOrAfter(rangeStart) && slotEnd.isSameOrBefore(rangeEnd)
      );
    });

    console.log('allSlotsWithinRange', allSlotsWithinRange);
    if (!allSlotsWithinRange)
      throw new BadRequestException(
        slotMessages.errors.slotTimingsMustBeWithinADaysRange,
      );

    if (this.overlapCheck(body.slots)) {
      const slot = await this.slotModel.findOneAndUpdate(
        { _id: body.id, userId: user.id },
        {
          $set: { ...body }, // Set the fields you want to update
          $unset: {
            id: 1, // Exclude id from the top-level object
            userId: 1, // Exclude userId from the top-level object
            'slots.$[elem].status': 1, // Exclude status from each element in the slots array
            'slots.$[elem].id': 1, // Exclude id from each element in the slots array
          },
        },
        {
          arrayFilters: [{ 'elem.id': { $exists: true } }],
          returnOriginal: false,
        },
      );
      if (!slot)
        throw new BadRequestException(
          slotMessages.errors.errorWhileUpdatingSlot,
        );
      return {
        message: slotMessages.messages.slotUpdated,
      };
    }
    throw new BadRequestException(slotMessages.errors.datesOverLap);
  }

  async getSlots(req: decodedRequest) {
    const user = await this.findUserByEmail(req.user.email);
    const slotsList = await this.slotModel
      .find(
        { userId: user.id },
        {
          id: 0, // Exclude id from the top-level object
          userId: 0, // Exclude userId from the top-level object
          'slots.status': 0, // Exclude status from each element in the slots array
          'slots.id': 0, // Exclude id from each element in the slots array
        },
      )
      .sort({ date: 1, 'slots.from': 1 })
      .exec();

    const updateSlots = slotsList.map((item: SlotsDocument) => {
      const currentDate = new Date();

      if (new Date(item.date) < currentDate) {
        const updatedSlots = item.slots.map((slot) => ({
          ...slot,
          status: BookingStatus.EXPIRED,
          id: item.id,
        }));
        item.slots = updatedSlots;
        return item;
      } else if (
        new Date(item.date).toISOString().split('T')[0] ===
        currentDate.toISOString().split('T')[0]
      ) {
        const updatedSlots = item.slots.map((slot) => {
          const slotFromTime = `${item.date.split('T')[0]}T${slot.from}:00Z`;
          if (new Date(slotFromTime) < currentDate) {
            return {
              ...slot,
              status: BookingStatus.EXPIRED,
              id: item.id,
            };
          } else {
            return slot;
          }
        });
        item.slots = updatedSlots;
        return item;
      } else {
        return item;
      }
    });

    return updateSlots;
  }

  async getSlotsByUserId(userId: string) {
    const slotsList = await this.slotModel
      .find({ userId })
      .select('-slots.customerId')
      .sort({ date: 1, 'slots.from': 1 })
      .exec();

    const updateSlots = slotsList.map((item: SlotsDocument) => {
      const currentDate = new Date();

      if (new Date(item.date) < currentDate) {
        const updatedSlots = item.slots.map((slot) => ({
          ...slot,
          status: BookingStatus.EXPIRED,
          id: item.id,
        }));
        item.slots = updatedSlots;
        return item;
      } else if (
        new Date(item.date).toISOString().split('T')[0] ===
        currentDate.toISOString().split('T')[0]
      ) {
        const updatedSlots = item.slots.map((slot) => {
          const slotFromTime = `${item.date.split('T')[0]}T${slot.from}:00Z`;
          if (new Date(slotFromTime) < currentDate) {
            return {
              ...slot,
              status: BookingStatus.EXPIRED,
              id: item.id,
            };
          } else {
            return slot;
          }
        });
        item.slots = updatedSlots;
        return item;
      } else {
        return item;
      }
    });

    return updateSlots;
  }

  async deleteSlot(id: string) {
    const slot = await this.slotModel.findByIdAndDelete(id);
    if (!slot) throw new BadRequestException(slotMessages.errors.noSlotFound);
    return {
      message: slotMessages.messages.slotDeleted,
    };
  }
}
