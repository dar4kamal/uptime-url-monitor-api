import { Injectable } from '@nestjs/common';

import { AlertFactory } from './alert.factory';
import { AlertInfo, AlertType, IAlert } from './alert.inteface';

@Injectable()
export class AlertService {
  private provider: IAlert;

  setProvider(alertType: AlertType) {
    this.provider = new AlertFactory(alertType).provider;
  }

  async sendAlert(alertInfo: AlertInfo) {
    await this.provider.sendAlert(alertInfo);
  }
}
