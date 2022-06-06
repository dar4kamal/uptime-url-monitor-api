import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Report } from './reports.schema';

@Injectable()
export class ReportsService {
  constructor(@InjectModel(Report.name) private reportModel: Model<Report>) {}
}
