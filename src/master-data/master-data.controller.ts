import { Body, Controller, Get, Post } from '@nestjs/common';
import { masterAuthorizedBaseUrls, masterDataUrls } from 'src/urls';
import { MasterDataService } from './master-data.service';
import { AddLanguageDTO } from 'src/dtos/addLanguageDto';
import { Request } from 'express';

@Controller(masterAuthorizedBaseUrls)
export class MasterDataController {
  constructor(private masterService: MasterDataService) {}
  @Get(masterDataUrls.languages)
  async getAllLanguages() {
    return this.masterService.getAllLanguages();
  }
  @Post(masterDataUrls.languages)
  async addnewLanguage(@Body() body: AddLanguageDTO, req: Request) {
    console.log('req', req);
    return this.masterService.addNewLanguage(body);
  }
}
