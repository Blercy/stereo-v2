import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand } from "@core";
import ms from "@stereobot/ms";

@PublicCommand("soundcloud", {
  aliases: ["sc"],
  description: {
    content: "Searches SoundCloud for the track searched.",
    usage: "[name]",
    examples: ["Josh A - So Tired"],
  },
  args: [
    {
      id: "query",
      match: "content",
      prompt: {
        start: "What would you like to search for?",
      },
    },
  ],
})
export default class SoundCloudCommand extends Command {
  public async exec(message: Message, { query }: { query: string }) {
    const data = await this.client.apis.get("soundcloud").track(query);

    if (!data.collection.length)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`I couldn't find anything for your query.`)
      );

    const {
      artwork_url,
      description,
      created_at,
      genre,
      title,
      uri,
    } = data.collection[0];

    return message.util?.send(
      new MessageEmbed()
        .setColor("#FE5000")
        .setAuthor(
          `${title.shorten(55)} (${genre ?? "Unknown"})`,
          message.author.displayAvatarURL({ dynamic: true }),
          uri
        )
        .setThumbnail(artwork_url)
        .setDescription(
          description ? description.shorten(512) : "No description."
        )
        .setFooter(
          `Created on ${new Date(created_at).toLocaleDateString()} (${ms(
            Date.now() - new Date(created_at).getTime()
          )} ago)`
        )
    );
  }
}
