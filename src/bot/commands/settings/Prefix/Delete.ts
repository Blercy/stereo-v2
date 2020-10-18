import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { Sub } from "@core";

@Sub("prefix-delete", [
  {
    id: "prefix",
    match: "content",
    prompt: {
      start: "Please provide a prefix to remove",
    },
  },
])
export default class PrefixCommand extends Command {
  public exec(message: Message, { prefix }: { prefix: string }) {
    prefix = prefix.replace(/`/g, "");

    const prefixes: string[] = this.client.settings.get(
      message.guild,
      "prefix.prefixes",
      config.get("bot.prefixes")
    );

    if (!prefixes.includes(prefix))
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`That prefix doesn't exist.`)
      );

    prefixes.splice(prefixes.indexOf(prefix));
    this.client.settings.set(message.guild, "prefix.prefixes", prefixes);

    //@ts-expect-error
    if (!prefixes.length && !this.handler.allowMention(message))
      this.client.settings.set(message.guild, "prefix.mention", true);

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(
          `Okay, I've now successfully removed the prefix: \`${prefix}\`.${
            !prefixes.length
              ? "\nYou will now have to use a mention prefix because you removed all of the prefixes."
              : ""
          }`
        )
    );
  }
}
