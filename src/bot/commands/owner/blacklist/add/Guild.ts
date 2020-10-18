import { Command } from "discord-akairo";
import { MessageEmbed, Message, Guild } from "discord.js";

import { Sub } from "@core";

@Sub("blacklist-add-guild", [
  {
    id: "guild",
    type: "guild",
    prompt: {
      start: "Please provide a guild to blacklist",
      retry: "I don't think that's a valid guild, maybe retry?",
    },
  },

  {
    id: "reason",
    match: "rest",
    default: "No reason provided.",
  },
])
export default class BlacklistCommand extends Command {
  public exec(
    message: Message,
    { guild, reason }: { guild: Guild; reason: string }
  ) {
    if (config.get<string[]>("bot.whitelist.guilds")?.includes(guild.id))
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `Why are you trying to blacklist a whitelisted guild?`
          )
      );

    const blacklist: any[] = this.client.settings.get(
      null,
      "blacklist.guilds",
      []
    );
    if (blacklist.some((g) => g.id === guild.id))
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`\`${guild.name}\` is already blacklisted.`)
      );

    blacklist.push({
      id: guild.id,
      reason,
      date: Date.now(),
    });

    this.client.settings.set(null, "blacklist.guilds", blacklist);

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(`Blacklisted \`${guild.name}\` successfully.`)
    );
  }
}
