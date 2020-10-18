import { readFileSync, existsSync, writeFileSync } from "fs";
import { get, set, delete as del } from "dot-prop";
import { parse, stringify } from "yaml";
import { join } from "path";

export class Configuration {
  private static _instance: Configuration;

  public parsed: Record<string, any> = {};
  private readonly path = join(process.cwd(), "config.yml");

  private constructor() {
    this.parse();
  }

  public parse(): void {
    if (!existsSync(this.path)) {
      console.error("Please create a 'config.yml'");

      return process.exit(1);
    }

    const data = readFileSync(this.path, { encoding: "utf8" });
    this.parsed = parse(data);
  }

  public get<T>(path: string): T | undefined {
    return get(this.parsed, path);
  }

  public set(path: string, value: any): void {
    set(this.parsed, path, value);
    writeFileSync(this.path, stringify(this.parsed), {
      encoding: "utf8",
    });

    this.parse();
  }

  public delete(path: string): void {
    del(this.parsed, path);
    writeFileSync(this.path, stringify(this.parsed), {
      encoding: "utf8",
    });

    this.parse();
  }

  public static getInstance(): Configuration {
    if (!Configuration._instance) {
      Configuration._instance = new Configuration();

      return Configuration._instance;
    }

    return Configuration._instance;
  }
}
