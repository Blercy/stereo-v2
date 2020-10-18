import "module-alias/register";

import { Configuration, Stereo } from "@core";
import { PrismaClient } from "@prisma/client";
import { init } from "@sentry/node";

(global as any).prisma = new PrismaClient();
(global as any).config = Configuration.getInstance();

const bot = new Stereo({
  token: config.get("bot.token") as string,
  prefixes: config.get("bot.prefixes") as string[],
  owners: config.get("bot.whitelist.owners") as string[],
});

import "./core/extensions/Player";

(async () => {
  init({
    dsn: config.get("bot.dsn"),
  });

  await bot.run();

  await prisma.$connect().then(() => {
    if (bot.shard!.ids[0] === 0)
      bot.logger.info(`Connected to PostgreSQL via prisma.`);
  });
})();
