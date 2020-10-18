import fetch from "node-fetch";
import {
  Logger,
  ConsoleTransport,
  PrettyFormatter,
  LogLevel,
} from "@melike2d/logger";

export interface APIOptions {
  name?: string;
  baseUrl?: string;
  headers?: any;
}

export class API {
  public options: APIOptions;

  public logger = new Logger(`apis.${this.constructor.name.toLowerCase()}`, {
    transports: [
      new ConsoleTransport({
        formatter: new PrettyFormatter({
          dateFormat: "HH:mm:ss YYYY/MM/DD",
        }),
        level: LogLevel.TRACE,
      }),
    ],
  });

  public constructor(options: APIOptions) {
    this.options = options;

    //@ts-expect-error
    if (this.init !== undefined) this.init();
  }

  public post(endpoint: string, body = {}) {
    return fetch(`${this.options.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.options.headers,
      body: body as any,
    }).then((res) => res.json()) as any;
  }

  public get(endpoint: string) {
    return fetch(`${this.options.baseUrl}${endpoint}`, {
      headers: this.options.headers,
    }).then((res) => res.json()) as any;
  }
}
