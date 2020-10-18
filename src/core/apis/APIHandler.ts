import { readdirSync, lstatSync, existsSync } from "fs";
import { join } from "path";

export class ApiHandler extends Map<string, any> {
  public path: string;

  public constructor(path: string) {
    super();

    if (!existsSync(path) || !lstatSync(path).isDirectory())
      throw new Error(`path is not a directory or does not exist`);

    this.path = path;
  }

  public loadAll() {
    for (const file of this.read(this.path)) {
      const mod = new (require(join(process.cwd(), file)).default)();

      this.set(mod.options.name, mod);
    }
  }

  private read(dir: string, files = []): string[] {
    for (const file of readdirSync(dir)) {
      const path = join(dir, file);
      //@ts-expect-error
      if (lstatSync(path).isDirectory()) files.concat(this.read(path, files));
      //@ts-expect-error
      else files.push(path);
    }

    return files;
  }
}
