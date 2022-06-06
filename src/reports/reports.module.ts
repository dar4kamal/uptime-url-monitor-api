import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ReportsService } from './reports.service';
import { Report, ReportSchema } from './reports.schema';
import { ReportsController } from './reports.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
