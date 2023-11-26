import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { SlotDTO } from 'src/dtos/slotDto';
import { decodedRequest } from 'src/middlewares/token-validator-middleware';
import { SLOTS_MODEL, SlotsDocument } from 'src/schemas/slots-schema';
import { USER_MODEL, UserDocument } from 'src/schemas/user-schema';
import { slotMessages, userMessages } from 'src/utils/constants';

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

  private overlapCheck(value: any) {
    for (let i = 0; i < value.length - 1; i++) {
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
      const slot = await this.slotModel.create({
        ...body,
        userId: user.id,
      });
      return slot;
    }
    return { message: slotMessages.errors.datesOverLap };
  }

  async updateSlot(req: decodedRequest, body: SlotDTO, id: string) {
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
        data: body,
      };
    }
    return { message: slotMessages.errors.datesOverLap };
  }

  async getSlots(req: decodedRequest) {
    const user = await this.findUserByEmail(req.user.email);
    const slotsList = await this.slotModel.find({ userId: user.id });
    return slotsList;
  }

  async getSlotsByUserId(userId: string) {
    const slotsList = await this.slotModel.find({ userId });
    return slotsList;
  }

  async deleteSlot(id: string) {
    const slot = await this.slotModel.findByIdAndDelete(id);
    if (!slot) throw new BadRequestException(slotMessages.errors.noSlotFound);
    return {
      message: slotMessages.messages.slotDeleted,
    };
  }
}
