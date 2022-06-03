import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping(): string {
    return 'Uptime URL Monitor API is Available ...';
  }
}
