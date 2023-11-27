import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { BookSlotDTO } from 'src/dtos/slotDto';
import { ObjectIdValidationPipe } from 'src/pipes/objectIdValidationPipe';
import { authorizedUrls, slotBookingUrls } from 'src/utils/urls';
import { BookslotsService } from './bookslots.service';

@Controller(authorizedUrls)
export class BookslotsController {
  constructor(private readonly bookSlotsService: BookslotsService) {}

  @Post(slotBookingUrls.bookSlotOfServiceProvider)
  async bookSlot(@Req() req: Request, @Body() body: BookSlotDTO) {
    return this.bookSlotsService.bookSlot(req, body);
  }
}
