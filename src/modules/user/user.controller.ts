import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { authorizedUrls, userUrls } from 'src/utils/urls';
import { UserService } from './user.service';
import { Request } from 'express';
import { UpdateUserDTO } from 'src/dtos/userDto';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnums } from 'src/utils/enums';
import { RolesGuard } from 'src/guards/role.guard';

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

  @Get(userUrls.getServiceProvidersList)
  async getAllServiceProviders() {
    return this.userService.getAllServiceProviders();
  }

  @Get(userUrls.getUsersList)
  @Roles([RoleEnums.SUPERADMIN])
  @UseGuards(RolesGuard)
  async getUsersList() {
    return this.userService.getAllUsersList();
  }
}
