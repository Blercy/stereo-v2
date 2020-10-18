import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { PublicCommand } from "@core";

@PublicCommand("skip", {
  aliases: ["next"],
  description: { content: "Skips to the next song" },
  channel: "guild",
})
export default class SkipCommand extends Command {
  public exec(message: Message) {
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

    if (player.queue.loop !== "none") player.queue.loop = "none";

    player.stop();

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(`I have now skipped the current song.`)
    );
  }
}
