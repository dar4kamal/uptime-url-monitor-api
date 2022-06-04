import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Check } from './checks.schema';
import AddCheckDTO from './dto/addCheck.dto';
import { User } from 'src/users/users.schema';

@Injectable()
export class ChecksService {
  constructor(@InjectModel(Check.name) private checkModel: Model<Check>) {}

  async addCheck(checkDetails: AddCheckDTO, userDetails: User) {
    const {
      url,
      name,
      tags,
      path,
      port,
      assert,
      webhook,
      timeout,
      protocol,
      interval,
      threshold,
      ignoreSSL,
      httpHeaders,
      authentication,
    } = checkDetails;

    const { id } = userDetails;

    const newCheck = new this.checkModel({ ...checkDetails, userId: id });
    // TODO create a report record
    // TODO create cron job
    // TODO check webhook => within cron
    // TODO check assert => within cron
    await newCheck.save();

    return 'a check has been created successfully';
  }
}
