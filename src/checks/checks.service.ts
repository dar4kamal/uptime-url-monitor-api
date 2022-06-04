import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Check } from './checks.schema';

@Injectable()
export class ChecksService {
  constructor(@InjectModel(Check.name) private checkModel: Model<Check>) {}
}
