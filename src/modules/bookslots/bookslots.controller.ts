import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { SlotBookingsDTO } from 'src/dtos/slotDto';
import { slotsUrl } from 'src/utils/urls';
import { BookslotsService } from './bookslots.service';
import { Request } from 'express';
import { ObjectIdValidationPipe } from 'src/pipes/objectIdValidationPipe';

@Controller(slotsUrl.bookSlot)
export class BookslotsController {
  constructor(private readonly bookSlotsService: BookslotsService) {}

  @Post(slotsUrl.bookSlotOfUser)
  async bookSlot(
    @Req() req: Request,
    @Body() body: SlotBookingsDTO,
    @Param('userId', ObjectIdValidationPipe) userId: string,
  ) {
    return this.bookSlotsService.bookSlot(req, body, userId);
  }
}
