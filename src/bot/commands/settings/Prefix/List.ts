import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { Sub } from "@core";

@Sub("prefix-list")
export default class PrefixCommand extends Command {
  public exec(message: Message) {
    const { mention, prefixes } = this.client.settings.get(
      message.guild,
      "prefix"
    );

    return message.util?.send(
      new MessageEmbed()
        .setColor("#7289DA")
        .setAuthor(
          `Prefixes for ${message.guild?.name.shorten(45)}`,
          message.guild?.iconURL({ dynamic: true })!
        )
        .setDescription([
          `Here are the guild prefix settings:`,
          `\nYou have mention prefix \`${mention ? "on" : "off"}\`\n`,
          prefixes
            .map((p: string, i: number) => `**${i + 1}.** \`${p}\``)
            .join(",\n"),
        ])
    );
  }
}
