export class Logger {
  private readonly logs: string[];

  public constructor() {
    this.logs = [];
  }

  public log(message: any) {
    this.logs.push(message);
  }

  public getLogs() {
    return this.logs;
  }
}
