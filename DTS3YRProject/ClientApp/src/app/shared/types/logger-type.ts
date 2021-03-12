export interface ILogger {
  d(...args: any[]): void; //
  w(...args: any[]): void; // Warning
  e(...args: any[]): void; // Error
}

export interface ILogService {
  get(name: string): ILogger;
}
