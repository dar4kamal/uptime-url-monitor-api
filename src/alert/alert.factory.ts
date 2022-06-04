import { AlertType, IAlert } from './alert.inteface';
import EmailProvider from './providers/email.provider';

export class AlertFactory {
  provider: IAlert;

  constructor(alertType: AlertType) {
    switch (alertType) {
      default:
        this.provider = new EmailProvider();
        break;
    }
  }
}
