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
import { Roles } from 'src/decorators/roles.decorator';
import {
  AddLanguageDTO,
  AddSpecializationDTO,
  PaginationDTO,
} from 'src/dtos/masterDto';
import { RoleEnums } from 'src/utils/enums';
import { RolesGuard } from 'src/guards/role.guard';
import { ObjectIdValidationPipe } from 'src/pipes/objectIdValidationPipe';
import { masterAuthorizedBaseUrls, masterDataUrls } from 'src/utils/urls';
import { MasterDataService } from './master-data.service';

@Controller(masterAuthorizedBaseUrls)
export class MasterDataController {
  constructor(private masterService: MasterDataService) {}

  @Post(masterDataUrls.languages)
  async getAllLanguages(@Req() req: Request, @Body() body: PaginationDTO) {
    return this.masterService.getAllLanguages(req, body);
  }

  @Roles([RoleEnums.SUPERADMIN])
  @UseGuards(RolesGuard)
  @Post(masterDataUrls.addLanguage)
  async addnewLanguage(@Body() body: AddLanguageDTO) {
    return this.masterService.addNewLanguage(body);
  }

  @Roles([RoleEnums.SUPERADMIN])
  @UseGuards(RolesGuard)
  @Put(masterDataUrls.updateLanguage)
  async updateLanguage(
    @Body() body: AddLanguageDTO,
    @Param('id', ObjectIdValidationPipe) id: string,
  ) {
    return this.masterService.updateLanguage(body, id);
  }

  @Roles([RoleEnums.SUPERADMIN])
  @UseGuards(RolesGuard)
  @Delete(masterDataUrls.updateLanguage)
  async deleteLanguage(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.masterService.deleteLanguage(id);
  }

  @Post(masterDataUrls.specializations)
  async getAllSpecializations(
    @Req() req: Request,
    @Body() body: PaginationDTO,
  ) {
    return this.masterService.getAllSpecializations(req, body);
  }

  @Roles([RoleEnums.SUPERADMIN])
  @UseGuards(RolesGuard)
  @Post(masterDataUrls.addSpecializations)
  async addNewSpecialization(@Body() body: AddSpecializationDTO) {
    return this.masterService.addNewSpecialization(body);
  }

  @Roles([RoleEnums.SUPERADMIN])
  @UseGuards(RolesGuard)
  @Put(masterDataUrls.updateSpecialization)
  async updateSpecialization(
    @Body() body: AddSpecializationDTO,
    @Param('id', ObjectIdValidationPipe) id: string,
  ) {
    return this.masterService.updateSpecialization(body, id);
  }

  @Roles([RoleEnums.SUPERADMIN])
  @UseGuards(RolesGuard)
  @Delete(masterDataUrls.updateSpecialization)
  async deleteSpecialization(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.masterService.deleteSpecialization(id);
  }
}
