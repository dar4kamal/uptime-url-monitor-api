import { HTTPHeaders } from 'src/axios/interfaces';
import { ReportHistory } from 'src/reports/interfaces';

export const PortRegex = new RegExp(/^([0-9]{1,5})$/gm);
const arrNumSum = (arr: number[]) => arr.reduce((acc, item) => acc + item, 0);

export const parseHeaders = (headers: HTTPHeaders[]) => {
  return headers.reduce((acc, header) => {
    const [k, v] = Object.entries(header)[0];
    acc[k] = v;
    return acc;
  }, {});
};

export const calculateResponseTime = (startTime: number) =>
  +((performance.now() - startTime) / 1000).toFixed(3);

export const calculateAvailability = (uptime: number, downtime: number) =>
  +((uptime / (uptime + downtime)) * 100).toFixed(3);

export const calculateAvgResponseTime = (history: ReportHistory[]) =>
  +(arrNumSum(history.map((i) => i.responseTime)) / history.length).toFixed(3);
