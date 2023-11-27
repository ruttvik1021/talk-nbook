import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { authorizedUrls, slotBookingUrls } from 'src/utils/urls';
import { BookingsService } from './bookings.service';
import { ServiceProviderGuard } from 'src/guards/serviceprovider.guard';
import { Request } from 'express';

@Controller(authorizedUrls)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get(slotBookingUrls.myBookings)
  @UseGuards(ServiceProviderGuard)
  async getMyBookings(@Req() req: Request) {
    return this.bookingsService.getMyBookings(req);
  }

  @Get(slotBookingUrls.myAppointments)
  async getMyAppointments(@Req() req: Request) {
    return this.bookingsService.getMyAppointments(req);
  }
}
