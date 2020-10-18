import { Command } from "discord-akairo";
import { MessageEmbed, Message, Guild } from "discord.js";

import { Sub } from "@core";
import ms from "ms";

@Sub("blacklist-view-guild", [
  {
    id: "guild",
    type: "guild",
    prompt: {
      start: "Please provide a guild to view information on..",
      retry: "I don't think thats a valid guild. Want to try again?",
    },
  },
])
export default class BlacklistCommand extends Command {
  public exec(message: Message, { guild }: { guild: Guild }) {
    const blacklist: any[] = this.client.settings.get(
      null,
      "blacklist.guilds",
      []
    );
    const found = blacklist.find((usr) => usr.id === guild.id);
    if (!found)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `I dunno what you're thinking, but that guild isn't blacklisted.`
          )
      );

    return message.util?.send(
      new MessageEmbed()
        .setAuthor(`Blacklist information: ${guild.name}`, guild.icon ?? "")
        .setColor("#7289DA")
        .setDescription(found.reason)
        .addField(`› Guild`, [guild.name, `(\`${guild.id}\`)`], true)
        .addField(
          `› Date`,
          `${new Date(found.date).toLocaleString()} (${ms(
            Date.now() - found.date
          )} ago)`,
          true
        )
    );
  }
}
