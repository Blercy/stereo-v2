import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { PublicCommand, trimArray } from "@core";
import { decode } from "@lavalink/encoding";

@PublicCommand("remove", {
  aliases: ["rm"],
  description: {
    content: "Removes song(s) from the queue",
    usage: "[song(s)]",
    examples: ["2", "4-7", "1, 3, 4"],
  },
  channel: "guild",
  args: [
    {
      id: "things",
      match: "content",
      prompt: {
        start: "Please provide what to remove.",
      },
    },
  ],
})
export default class RemoveCommand extends Command {
  public exec(message: Message, { things }: { things: string }) {
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

    const ints = things.match(/\d+/g);

    if (!ints || (Array.isArray(ints) && !ints.length))
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `Couldn't parse numbers, please follow the usage in the help command.`
          )
      );

    const tracks = player.queue.tracks;

    if (ints.length > 2) {
      const successful = [];

      for (let found of ints) {
        if (isNaN(found as any)) return;

        if (!tracks[Number(found) - 1] || Number(found) < 0) return;

        successful.push(found);

        tracks.splice(Number(found) - 1, 1);
      }

      if (!successful.length)
        return message.util?.send(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(`I couldn't remove anything that you provided.`)
        );

      return message.util?.send(
        new MessageEmbed()
          .setColor("#42f57e")
          .setDescription(
            `Removed the tracks at positions ${trimArray(successful, 5).join(
              ", "
            )}`
          )
      );
    }

    switch (ints.length) {
      case 1:
        if (isNaN(ints[0] as any))
          return message.util?.send(
            new MessageEmbed()
              .setColor("#f55e53")
              .setDescription(`Input must be a number.`)
          );

        if (!tracks[ints[0] as any])
          return message.util?.send(
            new MessageEmbed()
              .setColor("#f55e53")
              .setDescription(`Couldn't find the position (${ints[0]}).`)
          );

        const { title } = decode(tracks[Number(ints[0]) - 1].song);

        tracks.splice(Number(ints[0]) - 1, 1);

        return message.util?.send(
          new MessageEmbed()
            .setColor("#42f57e")
            .setDescription(
              `Removed the track *\`${title.shorten(25)}\`* at position ${
                ints[0]
              }`
            )
        );

        break;

      case 2:
        const [first, second]: any = ints;

        if (isNaN(first) || isNaN(second))
          return message.util?.send(
            new MessageEmbed()
              .setColor("#f55e53")
              .setDescription(`Both inputs must be a number.`)
          );

        if (!tracks[first])
          return message.util?.send(
            new MessageEmbed()
              .setColor("#f55e53")
              .setDescription(
                `The first number, ${first} is not a valid position.`
              )
          );

        if (!tracks[second])
          return message.util?.send(
            new MessageEmbed()
              .setColor("#f55e53")
              .setDescription(
                `The second number, ${second} is not a valid position.`
              )
          );

        if (
          first >= second ||
          (ints as any[]).includes(0) ||
          second - first === 1
        )
          return message.util?.send(
            new MessageEmbed()
              .setColor("#f55e53")
              .setDescription(
                `First input must not be greater than second, or numbers includes a 0`
              )
          );

        tracks.splice(first - 1, second);

        return message.util?.send(
          new MessageEmbed()
            .setColor("#42f57e")
            .setDescription(`Removed ${second - first} tracks.`)
        );

        break;
    }
  }
}
