import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";

import { PublicCommand } from "@core";
import ms from "@stereobot/ms";

@PublicCommand("itunes", {
  aliases: ["apple", "applemusic", "imusic"],
  description: {
    content: "Searches iTunes for a song",
    usage: "[query] <type>",
    examples: [
      "Josh A - So Tired",
      "The Kid LAROI - NOT FAIR -type album",
      "Despacito -type song",
    ],
  },
  args: [
    {
      id: "query",
      match: "rest",
      prompt: {
        start: "Please provide something to search for",
      },
    },

    {
      id: "type",
      type: (_, str) =>
        str
          ? ["song", "album"].includes(str.toLowerCase())
            ? str.toLowerCase()
            : null
          : null,
      unordered: true,
      match: "option",
      flag: ["-type ", "-t "],
      default: "song",
    },
  ],
})
export default class iTunesCommand extends Command {
  public async exec(
    message: Message,
    { query, type }: { query: string; type: "song" | "album" }
  ) {
    const nsfw = message.guild
      ? (message.channel as any).nsfw
        ? true
        : false
      : true;

    const search = await this.client.apis
      .get("itunes")
      [type](encodeURIComponent(query), nsfw);

    if (!search || !search.results.length)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`Couldn't find what you were looking for.`)
      );

    const result = search.results[0];

    const {
      artistName,
      artistViewUrl,
      collectionCensoredName,
      collectionName,
      artworkUrl100,
    } = result;

    switch (type) {
      case "song":
        return message.util?.send(
          new MessageEmbed()
            .setColor("#7289DA")
            .setAuthor(result.trackName, artworkUrl100, result.trackViewUrl)
            .setThumbnail(artworkUrl100)
            .setDescription([
              `**Artist**: [${artistName.shorten(25)}](${artistViewUrl})`,
              `**Album**: ${nsfw ? collectionName : collectionCensoredName}`,
              `**Price**: ${result.trackPrice} ${result.currency}`,
              `**Time**: ${ms(result.trackTimeMillis, {
                long: true,
                full: true,
              })}`,
            ])
        );

      case "album":
        return message.util?.send(
          new MessageEmbed()
            .setColor("#7289DA")
            .setAuthor(
              nsfw ? collectionName : collectionCensoredName,
              artworkUrl100,
              result.collectionViewUrl
            )
            .setThumbnail(artworkUrl100)
            .setDescription([
              `**Artist**: [${artistName.shorten(25)}](${artistViewUrl})`,
              `**Album**: ${nsfw ? collectionName : collectionCensoredName}`,
              `**Tracks**: ${result.trackCount}`,
              `**Price**: ${result.collectionPrice} ${result.currency}`,
            ])
            .setFooter(result.copyright)
        );
    }
  }
}
