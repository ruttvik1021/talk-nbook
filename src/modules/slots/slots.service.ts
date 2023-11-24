import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

  async createSlot(req: decodedRequest, body: SlotDTO) {
    const user = await this.findUserByEmail(req.user.email);

    const isSlotCreated = await this.slotModel.findOne({
      ...body,
      userId: user.id,
    });

    if (isSlotCreated)
      throw new BadRequestException(slotMessages.errors.slotAlreadyCreated);

    const slot = await this.slotModel.create({
      ...body,
      userId: user.id,
    });

    return slot;
  }
  async updateSlot(req: decodedRequest, body: SlotDTO, id: string) {
    const user = await this.findUserByEmail(req.user.email);

    const slot = await this.slotModel.findOneAndUpdate(
      { _id: id, userId: user.id },
      { ...body },
      { returnOriginal: false },
    );

    if (!slot)
      throw new BadRequestException(slotMessages.errors.errorWhileUpdatingSlot);

    return {
      message: slotMessages.messages.slotUpdated,
      data: body,
    };
  }

  async getSlots(req: decodedRequest) {
    const user = await this.findUserByEmail(req.user.email);
    const slotsList = await this.slotModel.find({ userId: user.id });
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
