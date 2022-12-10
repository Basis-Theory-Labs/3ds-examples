export class Logger {
    logs: string[];

    constructor() {
        this.logs = [];
    }

    log(message: any) {
        this.logs.push(message);
    }

    getLogs() {
        return this.logs
    }
}