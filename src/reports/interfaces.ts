import { URLStatus } from 'src/axios/enums';

export interface ReportHistory {
  createdAt: Date;
  status: URLStatus;
  responseTime: number;
}

export interface ReportIdConfigs {
  userId: string;
  checkId: string;
}
