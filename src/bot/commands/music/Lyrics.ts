import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { PublicCommand } from "@core";
import fetch from "node-fetch";

@PublicCommand("lyrics", {
  description: {
    content: "Searches for song lyrics",
    usage: "[song]",
    examples: ["emotions - iaan dior", "Ride it - Regard"],
  },
  args: [
    {
      id: "song",
      match: "content",
      prompt: {
        start: "Please provide a song to search for.",
      },
    },
  ],
})
export default class LyricsCommand extends Command {
  public async exec(message: Message, { song }: { song: string }) {
    const data = await (
      await fetch(
        `https://some-random-api.ml/lyrics?title=${encodeURIComponent(song)}`
      )
    ).json();

    if (data.error)
      return message.util?.send(
        new MessageEmbed().setColor("#f55e53").setDescription(data.error)
      );

    const { title, author, lyrics, thumbnail, links } = data;

    return message.util?.send(
      new MessageEmbed()
        .setColor("#7289DA")
        .setAuthor(
          `${title.shorten(45)} - ${author.shorten(45)}`,
          thumbnail.genius,
          links.genius
        )
        .setDescription(lyrics.shorten(1950))
    );
  }
}
