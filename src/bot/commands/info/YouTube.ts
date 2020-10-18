import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import { PublicCommand } from "@core";
import ms from "@stereobot/ms";

const endpoints = {
  video: "watch?v=",
  playlist: "playlist?list=",
};

@PublicCommand("youtube", {
  aliases: ["yt"],
  description: {
    content: "Searches the YouTube platform for anything.",
    usage: "[query] <-page id>",
    examples: ["How to tie a tie", "minecraft -page 2"],
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
      id: "page",
      type: "number",
      match: "option",
      flag: ["-page ", "-p "],
      default: 1,
    },
  ],
})
export default class YouTubeCommand extends Command {
  public async exec(
    message: Message,
    { query, page }: { query: string; page: number }
  ) {
    const { items } = await this.client.apis
      .get("youtube")
      .video(encodeURIComponent(query));

    if (!items.length)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`I couldn't find anything for that query.`)
      );

    if (!items[page - 1]) page = 1;

    const item = items[page - 1];
    const type = item.id.kind.split("youtube#")[1];

    return message.util?.send(
      new MessageEmbed()
        .setColor("#FF0000")
        .setAuthor(
          `${item.snippet.title.shorten(55)} (${type.capitalise()})`,
          message.author.displayAvatarURL({ dynamic: true }),
          `https://youtube.com/${
            type === "channel"
              ? `channel/${item.id.channelId}`
              : `${(endpoints as any)[type]}${
                  type === "video" ? item.id.videoId : item.id.playlistId
                }`
          }`
        )
        .setThumbnail(item.snippet.thumbnails.high.url)
        .setDescription(item.snippet.description.shorten(1900))
        .setFooter(
          `Created ${new Date(
            item.snippet.publishTime
          ).toLocaleDateString()} (${ms(
            Date.now() - new Date(item.snippet.publishTime).getTime()
          )} ago)`
        )
    );
  }
}
