import { ReportHistory } from 'src/reports/interfaces';

export interface URLAuth {
  username: string;
  password: string;
}

export interface HTTPHeaders {
  [key: string]: string;
}

export interface AssertStatusCode {
  statusCode: number;
}

export interface AxiosRequestAdditionalConfig {
  meta: {
    start: number;
    availability: number;
    responseTime: number;
    uptime: number;
    downtime: number;
    outages: number;
    history: ReportHistory[];
  };
}
