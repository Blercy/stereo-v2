import { Command } from "discord-akairo";
import { MessageEmbed, Message, Guild } from "discord.js";

import { Sub } from "@core";

@Sub("blacklist-delete-guild", [
  {
    id: "guild",
    type: "guild",
    prompt: {
      start: "Please provide a guild to remove from the blacklist",
      retry: "I don't think that's a valid guild, maybe retry?",
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
    if (!blacklist.some((g) => g.id === guild.id))
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`\`${guild.name}\` isn't even blacklisted.`)
      );

    blacklist.splice(blacklist.findIndex((g) => g.id === guild.id));

    this.client.settings.set(null, "blacklist.guilds", blacklist);

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(`Unblacklisted \`${guild.name}\` successfully.`)
    );
  }
}
