import { Controller, Post, Body } from '@nestjs/common';
import { InfoService } from './info.service';
import { UpdateInfoRequest } from './interfaces';
import { PersonDataRequest } from './interfaces/person.js';
import { BaseResponse } from '../interfaces';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Post('/validate')
  getConfig(@Body() bodyRequest: UpdateInfoRequest): Promise<BaseResponse> {
    return this.infoService.validateInfo(bodyRequest);
  }
  
  @Post('/validate-person')
  getConfigPerson(@Body() bodyRequest: PersonDataRequest): Promise<BaseResponse> {
    return this.infoService.validatePersonData(bodyRequest);
  }
}
