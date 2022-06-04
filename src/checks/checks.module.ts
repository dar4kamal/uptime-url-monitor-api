import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ChecksService } from './checks.service';
import { Check, CheckSchema } from './checks.schema';
import { ChecksController } from './checks.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Check.name, schema: CheckSchema }]),
  ],
  controllers: [ChecksController],
  providers: [ChecksService],
})
export class ChecksModule {}
