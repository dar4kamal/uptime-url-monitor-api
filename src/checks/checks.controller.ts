import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import AddCheckDTO from './dto/addCheck.dto';
import { User } from 'src/users/users.schema';
import { ChecksService } from './checks.service';
import { GetUser } from 'src/utils/getUser.decorator';
import { EndpointGuard } from 'src/utils/endpoint.guard';

@Controller('checks')
export class ChecksController {
  constructor(private checkService: ChecksService) {}

  @Post('add')
  @UseGuards(new EndpointGuard())
  addCheck(@Body() addCheckDTO: AddCheckDTO, @GetUser() user: User) {
    return this.checkService.addCheck(addCheckDTO, user);
  }
}
