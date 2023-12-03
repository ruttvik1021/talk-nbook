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

  private isOverlap(interval1: any, interval2: any): boolean {
    const from1 = new Date(`2000-01-01T${interval1.from}`);
    const to1 = new Date(`2000-01-01T${interval1.to}`);

    const from2 = new Date(`2000-01-01T${interval2.from}`);
    const to2 = new Date(`2000-01-01T${interval2.to}`);

    return from1 < to2 && to1 > from2;
  }

  private isValidTimeRange(from: string, to: string): boolean {
    const fromTime = new Date(`1970-01-01T${from}`);
    const toTime = new Date(`1970-01-01T${to}`);
    return fromTime < toTime;
  }

  private overlapCheck(value: any): boolean {
    for (let i = 0; i < value.length; i++) {
      const fromValue = value[i].from;
      const toValue = value[i].to;

      if (!this.isValidTimeRange(fromValue, toValue)) {
        throw new BadRequestException(
          slotMessages.errors.toTimeMustBeGreaterThanFromTime,
        );
      }

      const currentInterval = value[i];
      const nextIntervals = value.slice(i + 1);

      for (const nextInterval of nextIntervals) {
        if (this.isOverlap(currentInterval, nextInterval)) {
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

  async updateSlot(req: decodedRequest, body: UpdateSlotDTO, id: string) {
    const user = await this.findUserByEmail(req.user.email);
    if (this.overlapCheck(body.slots)) {
      const slot = await this.slotModel.findOneAndUpdate(
        { _id: id, userId: user.id },
        { ...body },
        { returnOriginal: false },
      );
      if (!slot)
        throw new BadRequestException(
          slotMessages.errors.errorWhileUpdatingSlot,
        );
      return {
        message: slotMessages.messages.slotUpdated,
      };
    }
    return { message: slotMessages.errors.datesOverLap };
  }

  async getSlots(req: decodedRequest) {
    const user = await this.findUserByEmail(req.user.email);
    const slotsList = await this.slotModel
      .find({ userId: user.id })
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
