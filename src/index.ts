import {
  Logger,
  ConsoleTransport,
  PrettyFormatter,
  LogLevel,
} from "@melike2d/logger";
import { ShardingManager } from "discord.js";
import { Configuration } from "@core";
import { join } from "path";

const config = Configuration.getInstance();

const manager = new ShardingManager(join(__dirname, "StereoBeta.js"), {
  token: config.get("bot.token"),
  totalShards: "auto",
});

const logger = new Logger("client.shards", {
  transports: [
    new ConsoleTransport({
      formatter: new PrettyFormatter({
        dateFormat: "HH:mm:ss YYYY/MM/DD",
      }),
      level: LogLevel.TRACE,
    }),
  ],
});

manager.spawn(manager.totalShards);

manager.on("shardCreate", (shard) => logger.info(`Spawned shard: ${shard.id}`));
