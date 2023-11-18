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
import { masterAuthorizedBaseUrls, masterDataUrls } from 'src/urls';
import { MasterDataService } from './master-data.service';
import { AddLanguageDTO } from 'src/dtos/masterDto';
import { Request } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnums } from 'src/enums';
import { RolesGuard } from 'src/guards/role.guard';

@Controller(masterAuthorizedBaseUrls)
export class MasterDataController {
  constructor(private masterService: MasterDataService) {}

  @Get(masterDataUrls.languages)
  async getAllLanguages(@Req() req: Request) {
    return this.masterService.getAllLanguages(req);
  }

  @Roles([RoleEnums.SUPERADMIN])
  @UseGuards(RolesGuard)
  @Post(masterDataUrls.languages)
  async addnewLanguage(@Body() body: AddLanguageDTO) {
    return this.masterService.addNewLanguage(body);
  }

  @Roles([RoleEnums.SUPERADMIN])
  @UseGuards(RolesGuard)
  @Put(masterDataUrls.updateLanguage)
  async updateLanguage(@Body() body: AddLanguageDTO, @Param('id') id: string) {
    return this.masterService.updateLanguage(body, id);
  }

  @Roles([RoleEnums.SUPERADMIN])
  @UseGuards(RolesGuard)
  @Delete(masterDataUrls.updateLanguage)
  async deleteLanguage(@Param('id') id: string) {
    return this.masterService.deleteLanguage(id);
  }

  @Get(masterDataUrls.categories)
  async getAllCategories(@Req() req: Request) {
    return this.masterService.getAllCategories(req);
  }

  @Roles([RoleEnums.SUPERADMIN])
  @UseGuards(RolesGuard)
  @Post(masterDataUrls.categories)
  async addNewCategory(@Body() body: any) {
    return this.masterService.addNewCategory(body);
  }
}
