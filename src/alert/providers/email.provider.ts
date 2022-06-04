import * as sendGridMail from '@sendgrid/mail';
import { GatewayTimeoutException } from '@nestjs/common';

import { AlertInfo, IAlert } from '../alert.inteface';

export default class EmailProvider implements IAlert {
  async sendAlert(alertInfo: AlertInfo) {
    const { to, from, content, subject } = alertInfo;

    sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = { to, from, subject, html: content };

    try {
      const emailResponse = sendGridMail.send(msg);
      if (emailResponse) console.log('Email is Sent ...');
    } catch (error) {
      console.log(error.message);
      throw new GatewayTimeoutException(
        'Email not sent, Please Try Again Later',
      );
    }
  }
}
