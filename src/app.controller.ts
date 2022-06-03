import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiTags('Ping')
  ping(): string {
    return this.appService.ping();
  }
}
