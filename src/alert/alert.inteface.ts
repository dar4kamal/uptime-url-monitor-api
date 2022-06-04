export interface AlertInfo {
  from: string;
  to: string;
  content: string;
  subject?: string;
}

export class IAlert {
  sendAlert: (alertInfo: AlertInfo) => Promise<void>;
}

export enum AlertType {
  Email = 'Email',
}
