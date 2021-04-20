import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { PublicCommand } from "@core";

@PublicCommand("stereo", {
  description: {
    content: "Makes the music only play in one ear",
    usage: "[?right | left | none]",
    examples: ["left", "right", "none"],
  },
  args: [
    {
      id: "side",
      type: [
        ["right", "r"],
        ["left", "l"],
        ["none", "off"],
      ],
    },
  ],
  channel: "guild",
})
export default class StereoCommand extends Command {
  public exec(message: Message, { side }: { side: "right" | "left" | "none" }) {
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

    if (!side) {
      return message.util?.send(
        new MessageEmbed()
          .setColor("#7289DA")
          .setDescription(
            `The current stereo setting is on the ${
              player.queue.stereoSide === "none"
                ? "none"
                : `${player.queue.stereoSide} ear`
            }`
          )
      );
    }

    if (side.toLowerCase() === "none") {
      player.queue.filter.type = "none";
      player.queue.filter.filters = {};

      player.send("filters", player.queue.filter.filters);

      return message.util?.send(
        new MessageEmbed()
          .setColor("#42f57e")
          .setDescription(
            `Okay, I've disabled the stereo setting. This will take a moment to apply.`
          )
      );
    }

    if (player.queue.stereoSide !== side.toLowerCase()) {
      player.queue.filter.type = "stereo";
      // @ts-expect-error - fuck off typescript i dont give two shits ok
      player.queue.stereoSide = side.toLowerCase();

      player.queue.filter.filters = {
        channelMix: {
          rightToLeft: 0,
          rightToRight: side.toLowerCase() === "right" ? 1 : 0,
          leftToRight: 0,
          leftToLeft: side.toLowerCase() === "left" ? 1 : 0,
        },
      };

      player.send("filters", player.queue.filter.filters);

      return message.util?.send(
        new MessageEmbed()
          .setColor("#42f57e")
          .setDescription(
            `Okay, I've enabled the stereo setting in the ${side.toLowerCase()} ear. This will take a moment to apply.`
          )
      );
    }
  }
}
