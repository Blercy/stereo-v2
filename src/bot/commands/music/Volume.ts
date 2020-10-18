import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { PublicCommand, prompt } from "@core";

@PublicCommand("volume", {
  aliases: ["vol"],
  description: {
    content: "Adjust the players volume",
    usage: "[?1-200]",
    examples: ["", "20"],
  },
  args: [
    {
      id: "volume",
      type: "number",
    },
  ],
  channel: "guild",
})
export default class VolumeCommand extends Command {
  public async exec(message: Message, { volume }: { volume: number }) {
    const player = this.client.lavalink.players.get(message.guild!.id);
    if (!player || !player?.queue.current)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`There is nothing playing.`)
      );

    if (!volume || volume < 1 || volume > 200)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#7289DA")
          .setDescription(`The current volume is **${player.volume}/200**`)
      );

    if (volume >= 100 && player.volume! <= 100) {
      const confirm = await prompt(
        message,
        `Are you sure you wnat to exceed the volume of 100?`
      );

      if (!confirm)
        return message.util?.send(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(`Okay, I won't set the volume above 100.`)
        );

      player.setVolume(volume);
    } else player.setVolume(volume);

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(`Set the volume to **${volume}**`)
    );
  }
}
