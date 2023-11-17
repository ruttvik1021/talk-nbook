import { Body, Controller, Get, Post } from '@nestjs/common';
import { masterDataUrls } from 'src/urls';
import { MasterDataService } from './master-data.service';
import { AddLanguageDTO } from 'src/dtos/addLanguageDto';

@Controller(masterDataUrls.masterBaseUrl)
export class MasterDataController {
  constructor(private masterService: MasterDataService) {}
  @Get(masterDataUrls.languages)
  async getAllLanguages() {
    return this.masterService.getAllLanguages();
  }
  @Post(masterDataUrls.languages)
  async addnewLanguage(@Body() body: AddLanguageDTO) {
    return this.masterService.addNewLanguage(body);
  }
}
