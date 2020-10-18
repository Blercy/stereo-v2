import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";

import { Sub, paginate } from "@core";
import ms from "ms";

@Sub("blacklist-list-guild", [
  {
    id: "p",
    type: "number",
    default: 0,
  },
])
export default class BlacklistCommand extends Command {
  public async exec(message: Message, { p }: { p: number }) {
    const blacklist: any[] = this.client.settings.get(
      null,
      "blacklist.guilds",
      []
    );

    if (!blacklist.length)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`There are no guilds blacklisted currently.`)
      );

    let { page, max, items } = paginate(blacklist, 3, p);
    items = await Promise.all(
      items.map(async (guild) => {
        const target = this.client.guilds.cache.get(guild.id);
        if (target)
          return {
            guild: `${target.name} (\`${target.id}\`)`,
            date: `${new Date(guild.date).toLocaleString()} (${ms(
              Date.now() - guild.date
            )} ago)`,
            reason: guild.reason.substring(0, 100),
          };
      })
    );

    return message.util?.send(
      new MessageEmbed()
        .setAuthor(
          `Guild blacklist`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setColor("#7289DA")
        .setDescription(
          items
            .map((data) =>
              [
                `**Guild**: ${data.guild}`,
                `**Date**: ${data.date}`,
                `**Reason**: ${data.reason}`,
              ].join("\n")
            )
            .join("\n")
        )
        .setFooter(`Page ${page}/${max}`)
        .setTimestamp(Date.now())
    );
  }
}
