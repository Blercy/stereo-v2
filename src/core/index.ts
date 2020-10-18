import "discord-akairo";

export * from "./general";
export * from "./database";
export * from "./music";
export * from "./apis";
export * from "./StereoClient";

import { PrismaClient } from "@prisma/client";
import { Configuration } from "./general";
import { Logger } from "@melike2d/logger";
import { GuildProvider } from "./database";
import { Manager } from "lavaclient";
import { ApiHandler } from "./apis";
import { Queue } from "./music";

declare global {
  const prisma: PrismaClient;
  const config: Configuration;
  const sentry: any;

  interface String {
    capitalise: () => string;
    shorten: (size?: number) => string;
    escapeMarkdown: () => string;
  }
}

declare module "discord-akairo" {
  interface AkairoClient {
    commands: CommandHandler;
    events: ListenerHandler;
    inhibitors: InhibitorHandler;
    cfg: StereoOptions;
    logger: Logger;
    settings: GuildProvider;
    lavalink: Manager;
    apis: ApiHandler;
  }
}

declare module "lavaclient" {
  interface Player {
    queue: Queue;
  }
}

export interface StereoOptions {
  token: string;
  owners: string | string[];
  prefixes: string[];
}

String.prototype.shorten = function (length = 45) {
  const str = this.replace(/[*_`~]/, (r) => `\\${r}`);
  return str.length >= length ? `${str.substring(0, length)}...` : str;
};

String.prototype.escapeMarkdown = function (length = 45) {
  return this.replace(/[*_`~]/, "")
    .replace(/\\.+?/g, "")
    .trim();
};

String.prototype.capitalise = function () {
  return this.replace(/(\b\w)/gi, (str: string) => str.toUpperCase());
};
