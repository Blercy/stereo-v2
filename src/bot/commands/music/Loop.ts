import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { PublicCommand } from "@core";

@PublicCommand("loop", {
  aliases: ["repeat"],
  description: {
    content: "Loops the queue or song.",
    usage: "[?song|track|queue]",
    examples: ["", "song", "queue"],
  },
  args: [
    {
      id: "type",
      type: [["song", "track"], "queue"],
    },
  ],
  channel: "guild",
})
export default class LoopCommand extends Command {
  public exec(message: Message, { type }: { type: "song" | "queue" }) {
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

    if (!type)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#7289DA")
          .setDescription(
            `You are currently looping ${
              player.queue.loop === "none"
                ? "nothing"
                : `the ${player.queue.loop.toLowerCase()}.`
            }`
          )
      );

    player.queue.loop === "none"
      ? (player.queue.loop = type.toLowerCase())
      : (player.queue.loop = "none");

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(
          `Okay, I will now ${
            player.queue.loop === type.toLowerCase() ? "start" : "stop"
          } looping ${
            player.queue.loop === "none"
              ? "nothing"
              : `the ${player.queue.loop.toLowerCase()}.`
          }`
        )
    );
  }
}
