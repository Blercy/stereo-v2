import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { PublicCommand } from "@core";

@PublicCommand("vaporwave", {
  aliases: ["vp"],
  description: { content: "V A P O R W A V E" },
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

    if (player.queue.filter.type !== "vaporwave") {
      player.queue.filter.type = "vaporwave";
      player.queue.filter.filters = {
        equalizer: [
          { band: 1, gain: 0.3 },
          { band: 0, gain: 0.3 },
        ],
        timescale: { pitch: 0.5 },
        tremolo: { depth: 0.3, frequency: 14 },
      };

      player.send("filters", {
        equalizer: [
          { band: 1, gain: 0.3 },
          { band: 0, gain: 0.3 },
        ],
        timescale: { pitch: 0.5 },
        tremolo: { depth: 0.3, frequency: 14 },
      });

      return message.util?.send(
        new MessageEmbed()
          .setColor("#42f57e")
          .setDescription(
            `${this.vaporwave("Enabled vaporwave")}. This will take a second.`
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
          `Okay, I've disabled vaporwave. This will take a second.`
        )
    );
  }

  public vaporwave(str: string) {
    return str
      .split("")
      .map((char) => {
        const text = char.charCodeAt(0);
        return text >= 33 && text <= 126
          ? String.fromCharCode(text - 33 + 65281)
          : char;
      })
      .join("");
  }
}
