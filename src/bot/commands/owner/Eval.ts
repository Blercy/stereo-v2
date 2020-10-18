import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { OwnerCommand } from "@core";
import { writeFileSync, unlinkSync } from "fs";
import fetch from "node-fetch";
import { inspect } from "util";
import ts from "typescript";
import { join } from "path";

@OwnerCommand("eval", {
  aliases: ["evaluate"],
  description: {
    content: "Evaluates JavaScript code and stuff",
    usage: "[code] [?depth|?ts]",
    examples: ["2 + 2", "this.client -depth 2", "const e: string = 'lol'; -ts"],
  },
  args: [
    {
      id: "code",
      match: "rest",
      prompt: {
        start: "Please provide something to evaluate",
      },
    },

    {
      id: "depth",
      type: "number",
      unordered: true,
      match: "option",
      flag: ["-d ", "-depth "],
      default: 0,
    },

    {
      id: "ts",
      match: "flag",
      unordered: true,
      flag: ["-ts", "-typescript"],
    },
  ],
})
export default class EvalCommand extends Command {
  public async exec(
    message: Message,
    { code, depth, ts }: { code: string; depth: number; ts: boolean }
  ) {
    try {
      const paste = await this.fetchPaste(code);
      if (paste && typeof paste === "string") code = paste;

      if (ts) code = this.compileTypeScript(code);

      const start = process.hrtime();
      let toEval = eval(code);
      let hr = process.hrtime(start);

      if (this.isPromise(toEval)) {
        toEval = await toEval;
        hr = process.hrtime(start);
      }

      let evaluated = inspect(toEval, false, depth ?? 0).toString();
      evaluated = this.removeSensativeInformation(evaluated);

      return message.util?.send([
        `⏱️ Took: ${hr[0] > 0 ? `${hr[0]}s ` : ""}${hr[1] / 1000000}ms`,
        `🔎 Type: ${this.type(toEval)}`,
        `\`\`\`${ts ? "ts" : "js"}\n${evaluated.substring(0, 1950)}\`\`\``,
      ]);
    } catch (error) {
      this.client.logger.error(error);

      return message.util?.send(
        `Whoopies, there was an error while evaluating!\`\`\`js\n${this.removeSensativeInformation(
          error.toString()
        ).substring(0, 1950)}\`\`\``
      );
    }
  }

  public type(value: any) {
    const type = typeof value;
    switch (type) {
      case "object":
        return value === null
          ? "null"
          : value.constructor
          ? value.constructor.name
          : "any";
      case "function":
        return `${value.constructor.name}(${value.length})`;
      case "undefined":
        return "void";
      default:
        return type;
    }
  }

  public isPromise(value: any) {
    return (
      value &&
      typeof value.then === "function" &&
      typeof value.catch === "function"
    );
  }

  public async fetchPaste(url: string) {
    let baseUrl = url.match(
      /(https?):\/\/([a-z]+\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}/gi
    );

    if (!baseUrl || !baseUrl.length) return;

    //@ts-expect-error
    baseUrl = baseUrl[0];

    let code = url
      .split("/")
      .pop()
      ?.replace(/\.[a-z]+/g, "");

    return await (await fetch(`${baseUrl}/raw/${code}`)).text();
  }

  // Stolen from: https://github.com/yamdbf/core/blob/master/src/command/base/EvalTS.ts#L68-L96
  public compileTypeScript(code: string) {
    const file = join(process.cwd(), `evaluted_${Date.now()}.ts`);
    writeFileSync(file, code);

    const program = ts.createProgram(
      [file],
      require(join(process.cwd(), "tsconfig.json"))
    );

    let diagnostics = ts.getPreEmitDiagnostics(program);
    let message!: string;

    if (diagnostics.length) {
      for (const diagnostic of diagnostics) {
        const _msg = diagnostic.messageText;
        const _file = diagnostic.file;
        const line = _file
          ? _file.getLineAndCharacterOfPosition(diagnostic.start!)
          : undefined;

        if (line === undefined) {
          message = _msg.toString();
          break;
        }

        const _line = line.line + 1;
        const _char = line.character + 1;
        message = `${_msg} (at '${_line}:${_char}')`;
      }
    }

    unlinkSync(file);
    if (message) throw new TypeError(message);

    return ts.transpileModule(
      code,
      require(join(process.cwd(), "tsconfig.json"))
    ).outputText;
  }

  public removeSensativeInformation(data: string) {
    const blacklist = [
      config.get("bot.token"),
      config.get("bot.dsn"),
      config.get("apis.spotify.secret"),
      config.get("apis.spotify.id"),
      config.get("apis.dbl"),
      config.get("apis.vps.key"),
      config.get("apis.vps.password"),
      config.get("bot.ip"),
      config.get("apis.youtube"),
      config.get("apis.soundcloud"),
    ];

    blacklist.push(
      ...config.get<any[]>("nodes")!.map((node: any) => node.password)
    );

    return data.replace(new RegExp(blacklist.join("|"), "gi"), "[redacted]");
  }
}
