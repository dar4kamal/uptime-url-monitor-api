import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

import { AxiosService } from './axios.service';
import { Report, ReportSchema } from 'src/reports/reports.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
  ],
  exports: [AxiosService],
  providers: [AxiosService],
})
export class AxiosModule {}
