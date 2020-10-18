import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { PublicCommand } from "@core";

@PublicCommand("clear", {
  aliases: ["clearqueue"],
  description: { content: "Clears the queue if there is one" },
  channel: "guild",
})
export default class ClearCommand extends Command {
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

    if (!player.queue.tracks.length)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`There's nothing to even clear.`)
      );

    player.queue.tracks = [];

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(`I have now cleared the queue!`)
    );
  }
}
