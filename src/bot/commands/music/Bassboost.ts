import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { PublicCommand } from "@core";

@PublicCommand("bassboost", {
  aliases: ["bb"],
  description: {
    content: "Change the bass of the song",
    usage: "[?number]",
    examples: ["", "80"],
  },
  args: [
    {
      id: "amount",
      type: "number",
    },
  ],
  channel: "guild",
})
export default class BassboostCommand extends Command {
  public exec(message: Message, { amount }: { amount: number }) {
    const player = this.client.lavalink.players.get(message.guild!.id);
    if (!player || !player?.queue.current)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`There is nothing playing.`)
      );

    if (player.channel !== message.member?.voice.channel?.id)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`Please join my voice channel.`)
      );

    if (!amount || amount < 1 || amount > 100)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#7289DA")
          .setDescription(
            `The current bass level is **${player.queue.bass * 100}%**`
          )
      );

    player.queue.bass = amount / 100;

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
        .setDescription(`Okay, I've set the bass level to **${amount}%**`)
    );
  }
}
