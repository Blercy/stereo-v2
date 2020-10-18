import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand } from "@core";
import ms from "@stereobot/ms";

@PublicCommand("spotify", {
  description: {
    content: "Searches spotify for a provided track name.",
    usage: "[name]",
    examples: ["Blueberry Faygo"],
  },
  args: [
    {
      id: "query",
      match: "content",
      prompt: {
        start: "Please provide a track name",
      },
    },
  ],
})
export default class SpotifyCommand extends Command {
  public async exec(message: Message, { query }: { query: string }) {
    const { tracks } = await this.client.apis.get("spotify").search(query);

    if (!tracks.items.length)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`I couldn't find anything for that query`)
      );

    const { name, album, artists, id, duration_ms } = tracks.items[0];

    return message.util?.send(
      new MessageEmbed()
        .setColor("#1DB954")
        .setAuthor(
          `${name.shorten(55)} - ${artists[0].name}`,
          message.author.displayAvatarURL({ dynamic: true }),
          `https://open.spotify.com/track/${id}`
        )
        .setDescription([
          `Track Duration: ${ms(duration_ms, { long: true, full: true })}`,
          `\nPublished ${new Date(
            album.release_date
          ).toLocaleDateString()} (${ms(
            Date.now() - new Date(album.release_date).getTime()
          )} ago)`,
        ])
        .setThumbnail(album.images.length ? album.images[0].url : "")
    );
  }
}
