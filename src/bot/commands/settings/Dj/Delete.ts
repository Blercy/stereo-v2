import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { Sub } from "@core";

@Sub("dj-delete")
export default class DjCommand extends Command {
  public exec(message: Message) {
    const current = this.client.settings.get(message.guild, "dj");
    if (!current)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`There is no DJ role set.`)
      );

    this.client.settings.delete(message.guild, "dj");

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(`Deleted the DJ role.`)
    );
  }
}
