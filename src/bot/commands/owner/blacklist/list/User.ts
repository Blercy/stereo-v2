import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";

import { Sub, paginate } from "@core";
import ms from "ms";

@Sub("blacklist-list-user", [
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
      "blacklist.users",
      []
    );

    if (!blacklist.length)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`There are no users blacklisted currently.`)
      );

    let { page, max, items } = paginate(blacklist, 3, p);
    items = await Promise.all(
      items.map(async (user) => {
        const target = await this.client.users.fetch(user.id);
        if (target)
          return {
            user: `${target.tag} (\`${user.id}\`)`,
            date: `${new Date(user.date).toLocaleString()} (${ms(
              Date.now() - user.date
            )} ago)`,
            reason: user.reason.substring(0, 100),
          };
      })
    );

    return message.util?.send(
      new MessageEmbed()
        .setAuthor(
          `User blacklist`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setColor("#7289DA")
        .setDescription(
          items
            .map((data) =>
              [
                `**User**: ${data.user}`,
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
