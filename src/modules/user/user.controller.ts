import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { authorizedUrls, userUrls } from 'src/urls';
import { UserService } from './user.service';
import { Request } from 'express';
import { UpdateUserDTO } from 'src/dtos/userDto';

@Controller(authorizedUrls)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(userUrls.getProfile)
  async getProfile(@Req() req: Request) {
    return this.userService.getProfile(req);
  }

  @Put(userUrls.getProfile)
  async updateProfile(@Req() req: Request, @Body() body: UpdateUserDTO) {
    return this.userService.updateProfile(req, body);
  }
}
