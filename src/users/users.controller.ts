import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import UserCredsDTO from './dto/userCreds.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('signup')
  signup(@Body() userCreds: UserCredsDTO) {
    return this.userService.signup(userCreds);
  }

  @Post('login')
  login(@Body() userCreds: UserCredsDTO) {
    return this.userService.loginUser(userCreds);
  }

  @Get('verify/:userId')
  verify(@Param('userId') userId: string, @Query('token') emailToken: string) {
    return this.userService.verifyCode(userId, emailToken);
  }
}
