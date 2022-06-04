import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './users.service';
import { User, UserSchema } from './users.schema';
import { UsersController } from './users.controller';

import { AlertModule } from 'src/alert/alert.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AlertModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
