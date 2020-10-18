import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { PublicCommand } from "@core";

@PublicCommand("join", {
  aliases: ["joinvc"],
  description: { content: "Joins your voice channel" },
  channel: "guild",
})
export default class JoinCommand extends Command {
  public exec(message: Message) {
    let player = this.client.lavalink.players.get(message.guild!.id);
    if (player && player.connected)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`I'm already connected to a voice channel!`)
      );

    const { channel } = message.member?.voice!;
    if (!channel)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`Please join a voice channel.`)
      );

    if (
      !channel.joinable ||
      !channel.permissionsFor(this.client.user!)?.has(["SPEAK", "CONNECT"])
    )
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`Please join a voice channel I can join.`)
      );

    if (!player) player = this.client.lavalink.create(message.guild!.id);
    player.connect(channel.id, { selfDeaf: true });

    message.guild?.me?.voice.setDeaf(true);

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(`Connected to \`${channel.name}\` successfully.`)
    );
  }
}
