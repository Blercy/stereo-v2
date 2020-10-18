import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { PublicCommand } from "@core";

@PublicCommand("slowed", {
  aliases: ["slow"],
  description: { content: "Slows down the music" },
  channel: "guild",
})
export default class SlowedCommand extends Command {
  public exec(message: Message) {
    const player = this.client.lavalink.players.get(message.guild!.id);
    if (!player)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`There is no player active right now.`)
      );

    if (player.channel !== message.member?.voice.channel?.id)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`Please join my voice channel.`)
      );

    if (player.queue.filter.type !== "slowed") {
      player.queue.filter.type = "slowed";
      player.queue.filter.filters = {
        equalizer: [
          { band: 1, gain: 0.3 },
          { band: 0, gain: 0.3 },
        ],
        timescale: { pitch: 1.1, rate: 0.8 },
        tremolo: { depth: 0.3, frequency: 14 },
      };

      player.send("filters", player.queue.filter.filters);

      return message.util?.send(
        new MessageEmbed()
          .setColor("#42f57e")
          .setDescription(
            `Okay, I've enabled slowed mode. This will take a second.`
          )
      );
    }

    player.queue.filter.type = "none";
    player.queue.filter.filters = {};
    player.send("filters", {});

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(
          `Okay, I've disabled slowed mode. This will take a second.`
        )
    );
  }
}
