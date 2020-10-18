import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { PublicCommand } from "@core";

@PublicCommand("disconnect", {
  aliases: ["leave", "fuckoff", "stop"],
  description: { content: "Makes the bot disconnect from your voice channel." },
  channel: "guild",
})
export default class DisconnectCommand extends Command {
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

    this.client.lavalink.destroy(message.guild!.id);

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(`Disconnected from your voice channel.`)
    );
  }
}
