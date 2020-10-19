import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { PublicCommand } from "@core";

@PublicCommand("soft", {
  aliases: ["soften"],
  description: { content: "Softens the music a bit" },
  channel: "guild",
})
export default class SoftCommand extends Command {
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

    if (player.queue.filter.type !== "soft") {
      player.queue.filter.type = "soft";
      player.queue.filter.filters = {};

      player.setEqualizer([
        { band: 0, gain: 0 },
        { band: 1, gain: 0 },
        { band: 2, gain: 0 },
        { band: 3, gain: 0 },
        { band: 4, gain: 0 },
        { band: 5, gain: 0 },
        { band: 6, gain: 0 },
        { band: 7, gain: 0 },
        { band: 8, gain: -0.25 },
        { band: 9, gain: -0.25 },
        { band: 10, gain: -0.25 },
        { band: 11, gain: -0.25 },
        { band: 12, gain: -0.25 },
        { band: 13, gain: -0.25 },
      ]);

      return message.util?.send(
        new MessageEmbed()
          .setColor("#42f57e")
          .setDescription(
            `Okay, I've softened the music up. This will take a second.`
          )
      );
    }

    player.queue.filter.type = "none";
    player.queue.filter.filters = {};
    player.setEqualizer([
      {
        band: 3,
        gain: player.queue.bass,
      },

      {
        band: 4,
        gain: player.queue.bass,
      },
    ]);

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(`Okay, I've harded the music. This will take a second.`)
    );
  }
}
