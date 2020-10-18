import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { Sub } from "@core";

@Sub("prefix-add", [
  {
    id: "prefix",
    match: "content",
    prompt: {
      start: "Please provide a prefix to add",
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

    if (prefixes.length >= 7)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`You may only have a total of 7 prefixes.`)
      );

    if (prefixes.includes(prefix))
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`That prefix already exists.`)
      );

    prefixes.push(prefix);
    this.client.settings.set(message.guild, "prefix.prefixes", prefixes);

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(
          `Okay, I've now successfully added the prefix: \`${prefix}\``
        )
    );
  }
}
