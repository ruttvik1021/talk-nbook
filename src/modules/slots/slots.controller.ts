import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { SlotDTO } from 'src/dtos/slotDto';
import { ServiceProviderGuard } from 'src/guards/serviceprovider.guard';
import { ObjectIdValidationPipe } from 'src/pipes/objectIdValidationPipe';
import { authorizedUrls, slotsUrl } from 'src/utils/urls';
import { SlotsService } from './slots.service';

@Controller(authorizedUrls)
@UseGuards(ServiceProviderGuard)
export class SlotsController {
  constructor(private readonly slotService: SlotsService) {}

  @Get(slotsUrl.bookSlotOfServiceProvider)
  async getSlotsByUser(@Param('id', ObjectIdValidationPipe) userId: string) {
    return this.slotService.getSlotsByUserId(userId);
  }

  @Put(slotsUrl.slotUrlId)
  async updateSlot(
    @Req() req: Request,
    @Body() body: SlotDTO,
    @Param('id', ObjectIdValidationPipe) id: string,
  ) {
    return this.slotService.updateSlot(req, body, id);
  }

  @Delete(slotsUrl.slotUrlId)
  async deleteSlot(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.slotService.deleteSlot(id);
  }

  @Post(slotsUrl.slotUrl)
  async createSlot(@Req() req: Request, @Body() body: SlotDTO) {
    return this.slotService.createSlot(req, body);
  }

  @Get(slotsUrl.slotUrl)
  async getSlots(@Req() req: Request) {
    return this.slotService.getSlots(req);
  }
}
