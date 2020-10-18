import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { PublicCommand } from "@core";

@PublicCommand("pause", {
  description: { content: "Pauses the player." },
  channel: "guild",
})
export default class PauseCommand extends Command {
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

    if (player.paused)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`The player is already paused!`)
      );

    player.pause();

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(`Paused the player successfully.`)
    );
  }
}
