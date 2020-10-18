import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { PublicCommand } from "@core";
import { decode } from "@lavalink/encoding";
import ms from "ms";

@PublicCommand("queue", {
  aliases: ["upnext"],
  description: {
    content: "Displays the queue",
    usage: "[?page]",
    examples: ["", "2"],
  },
  args: [
    {
      id: "p",
      type: "number",
      default: 0,
    },
  ],
  channel: "guild",
})
export default class QueueCommand extends Command {
  public exec(message: Message, { p }: { p: number }) {
    const player = this.client.lavalink.players.get(message.guild!.id);
    if (!player || !player?.queue.current)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`There is nothing playing.`)
      );

    const embed = new MessageEmbed()
      .setColor("#7289DA")
      .setAuthor(
        `Queue for ${message.guild!.name}`,
        message.guild?.iconURL({ dynamic: true })!
      );

    const { title, uri, length } = decode(player.queue.current.song);

    embed.setDescription(
      `**Currently Playing**:\n\n[${title.shorten()}](${uri})`
    );

    if (!player.queue.tracks.length) return message.util?.send(embed);

    const max = Math.ceil(player.queue.tracks.length / 10);

    if (p > max || p < 1) p = 1;

    const items = player.queue.tracks.map((data, i) => {
      const song = decode(data.song);

      return {
        title: `[${song.title.shorten()}](${song.uri})`,
        index: i + 1,
      };
    });

    const display = items.slice((p - 1) * 10, p * 10);

    if (p !== 1)
      embed.description = `Total queue time: ${ms(
        player.queue.tracks.reduce(
          (prev, curr) => prev + Number(decode(curr.song).length),
          0
        ) +
          Number(length) -
          player.position,
        { long: true }
      )}`;

    return message.util?.send(
      embed
        .addField(
          `Enqueued Tracks (${player.queue.tracks.length})`,
          display.map((data) => `\`#${data.index}\` | ${data.title}`)
        )
        .setFooter(`Page ${p}/${max}`)
    );
  }
}
