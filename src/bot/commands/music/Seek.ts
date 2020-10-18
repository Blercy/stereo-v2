import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { PublicCommand } from "@core";
import { decode } from "@lavalink/encoding";
import ms from "@stereobot/ms";

@PublicCommand("seek", {
  aliases: ["goto"],
  description: {
    content: "Seeks to a certian position in the song",
    usage: "[time]",
    examples: ["2m", "2m 3s"],
  },
  channel: "guild",
  args: [
    {
      id: "time",
      type: (_, str) =>
        str && typeof str === "string" ? ms(str) ?? null : null,
      prompt: {
        start: "Please provide a time",
        retry: "Want to give me a valid time?",
      },
    },
  ],
})
export default class SeekCommand extends Command {
  public exec(message: Message, { time }: { time: number }) {
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

    const { length } = decode(player.queue.current.song);
    if (Number(length) < time || time < 0)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`Time provided exceeds song time or is less than 0.`)
      );

    player.seek(time);

    const seeked = ms(time, { long: true, full: true });

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(
          `Seeked to **${seeked.length ? seeked : "the beginning"}**`
        )
    );
  }
}
