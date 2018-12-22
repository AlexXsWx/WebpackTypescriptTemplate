class Logger {
  // tslint:disable:no-console
  public log   (...args: Array<unknown>): void { console.log   (...args); }
  public warn  (...args: Array<unknown>): void { console.warn  (...args); }
  public error (...args: Array<unknown>): void { console.error (...args); }
  // tslint:enable:no-console
}

export const logger: Logger = new Logger();
