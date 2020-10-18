import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { PublicCommand } from "@core";

@PublicCommand("nightcore", {
  aliases: ["nc"],
  description: { content: "Pitches up and speeds up the music" },
  channel: "guild",
})
export default class NightcoreCommand extends Command {
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

    if (player.queue.filter.type !== "nightcore") {
      player.queue.filter.type = "nightcore";
      player.queue.filter.filters = {
        equalizer: [
          { band: 1, gain: 0.1 },
          { band: 0, gain: 0.1 },
        ],
        timescale: { pitch: 1.2, speed: 1.1 },
        tremolo: { depth: 0.3, frequency: 14 },
      };

      player.send("filters", player.queue.filter.filters);

      return message.util?.send(
        new MessageEmbed()
          .setColor("#42f57e")
          .setDescription(
            `Okay, I've enabled nightcore. This will take a second.`
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
          `Okay, I've disabled nightcore. This will take a second.`
        )
    );
  }
}
