import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ChecksService } from './checks.service';
import { Check, CheckSchema } from './checks.schema';
import { ChecksController } from './checks.controller';

import { AxiosModule } from 'src/axios/axios.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Check.name, schema: CheckSchema }]),
    AxiosModule,
    HttpModule,
  ],
  controllers: [ChecksController],
  providers: [ChecksService],
})
export class ChecksModule {}
