import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { PublicCommand } from "@core";
import { decode } from "@lavalink/encoding";

@PublicCommand("nowplaying", {
  aliases: ["np"],
  description: { content: "Shows the currently playing song" },
  channel: "guild",
})
export default class NowplayingCommand extends Command {
  public exec(message: Message) {
    const player = this.client.lavalink.players.get(message.guild!.id);
    if (!player || !player?.queue.current)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`There is nothing playing.`)
      );

    const { title, identifier, length, uri } = decode(
      player.queue.current.song
    );

    return message.util?.send(
      new MessageEmbed()
        .setColor("#7289DA")
        .setAuthor(
          title.shorten(100),
          message.author.displayAvatarURL({ dynamic: true }),
          uri ?? ""
        )
        .setThumbnail(`https://i.ytimg.com/vi/${identifier}/maxresdefault.jpg`)
        .setDescription([
          `\`${this.time(player.position)} ${this.progress(
            player.position,
            Number(length)
          )} ${this.time(Number(length))}\``,
        ])
    );
  }

  public progress(position: number, duration: number) {
    return (
      "▬".repeat(Math.floor((position / Number(duration)) * 20)) +
      "o" +
      "⎼".repeat(20 - Math.floor((position / Number(duration)) * 20))
    );
  }

  public time(ms: number) {
    if (ms >= 36000000) return "...";

    const hours = Math.floor((ms / (1e3 * 60 * 60)) % 60),
      minutes = Math.floor(ms / 6e4),
      seconds = ((ms % 6e4) / 1e3).toFixed(0);

    return `${hours ? `${hours}:` : ""}${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
}
