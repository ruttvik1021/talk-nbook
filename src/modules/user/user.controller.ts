import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { authorizedUrls, userUrls } from 'src/utils/urls';
import { UserService } from './user.service';
import { Request } from 'express';
import { GetUserBySpecilizationDTO, UpdateUserDTO } from 'src/dtos/userDto';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnums } from 'src/utils/enums';
import { RolesGuard } from 'src/guards/role.guard';
import { ObjectIdValidationPipe } from 'src/pipes/objectIdValidationPipe';
import { PaginationDTO } from 'src/dtos/masterDto';

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

  @Post(userUrls.getServiceProvidersList)
  async getAllServiceProviders(@Body() body: GetUserBySpecilizationDTO) {
    return this.userService.getAllServiceProviders(body);
  }

  @Post(userUrls.getUsersList)
  @Roles([RoleEnums.SUPERADMIN])
  @UseGuards(RolesGuard)
  async getUsersList(@Body() body: PaginationDTO) {
    return this.userService.getAllUsersList(body);
  }

  @Get(userUrls.getUserById)
  async getUserById(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.userService.getUserById(id);
  }

  @Get(userUrls.deactivateUserById)
  @Roles([RoleEnums.SUPERADMIN])
  @UseGuards(RolesGuard)
  async deactivateUserById(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.userService.deactivateUserById(id);
  }
}
