import { Body, Controller, Post, Req } from '@nestjs/common';
import { SlotBookingsDTO } from 'src/dtos/slotDto';
import { slotsUrl } from 'src/utils/urls';
import { BookslotsService } from './bookslots.service';
import { Request } from 'express';

@Controller(slotsUrl.bookSlot)
export class BookslotsController {
  constructor(private readonly bookSlotsService: BookslotsService) {}

  @Post()
  async bookSlot(@Req() req: Request, @Body() body: SlotBookingsDTO) {
    return this.bookSlotsService.bookSlot(req, body);
  }
}
