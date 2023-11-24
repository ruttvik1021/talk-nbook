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
import { slotsUrl } from 'src/utils/urls';
import { SlotsService } from './slots.service';

@Controller(slotsUrl.slotUrl)
@UseGuards(ServiceProviderGuard)
export class SlotsController {
  constructor(private readonly slotService: SlotsService) {}

  @Put(':id')
  async updateSlot(
    @Req() req: Request,
    @Body() body: SlotDTO,
    @Param('id', ObjectIdValidationPipe) id: string,
  ) {
    return this.slotService.updateSlot(req, body, id);
  }

  @Delete(':id')
  async deleteSlot(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.slotService.deleteSlot(id);
  }

  @Post()
  async createSlot(@Req() req: Request, @Body() body: SlotDTO) {
    return this.slotService.createSlot(req, body);
  }

  @Get()
  async getSlots(@Req() req: Request) {
    return this.slotService.getSlots(req);
  }
}
