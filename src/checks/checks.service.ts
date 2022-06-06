import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';

import { Check } from './checks.schema';
import AddCheckDTO from './dto/addCheck.dto';
import { User } from 'src/users/users.schema';

import { AxiosService } from 'src/axios/axios.service';

@Injectable()
export class ChecksService {
  constructor(
    @InjectModel(Check.name) private checkModel: Model<Check>,
    private axiosService: AxiosService,
  ) {}

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

    const newCheck = new this.checkModel({
      ...checkDetails,
      userId: userDetails.id,
    });

    try {
      // TODO create cron job
      await newCheck.save();

      await this.axiosService.request(
        {
          url,
          path,
          port,
          assert,
          webhook,
          timeout,
          interval,
          protocol,
          ignoreSSL,
          threshold,
          httpHeaders,
          authentication,
        },
        { userId: userDetails.id, checkId: newCheck.id },
      );

      return 'Your check has been created successfully';
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}
