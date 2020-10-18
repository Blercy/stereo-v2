import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";

import { PublicCommand } from "@core";

@PublicCommand("shards", {
  description: { content: "Displays all shards" },
  channel: "guild",
})
export default class ShardsCommand extends Command {
  public async exec(message: Message) {
    const data = await this.client.shard!.broadcastEval(`[
        this.guilds.cache.size,
        this.users.cache.size,
        (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
        this.ws.ping,
        this.shard.mode,
        this.lavalink.players.size
      ]`);

    const embed = new MessageEmbed()
      .setColor("#7289DA")
      .setAuthor(
        `Shards (${this.client.shard!.count} shard${
          this.client.shard!.count > 1 ? "s" : ""
        })`,
        message.author.displayAvatarURL({ dynamic: true })
      );

    data.map((data, i) =>
      embed.addField(
        `› Shard ${i} ${message.guild!.shardID === i ? "(Current)" : ""}`,
        [
          `\`\`\`apache`,
          `Guilds  : ${data[0]}`,
          `Users   : ${data[1]}`,
          `Memory  : ${data[2]}mbs`,
          `Ping    : ${data[3]}ms`,
          `Online  : ${data[4] === "process" ? "Yes" : "No"}`,
          `Players : ${data[5]}`,
          `\`\`\``,
        ],
        true
      )
    );

    return message.util?.send(embed);
  }
}
