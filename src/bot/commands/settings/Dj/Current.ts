import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { Sub } from "@core";

@Sub("dj-current")
export default class DjCommand extends Command {
  public exec(message: Message) {
    const dj = this.client.settings.get(message.guild, "dj");
    return message.util?.send(
      new MessageEmbed()
        .setColor("#7289DA")
        .setDescription(
          `The current DJ role is ${dj ? `<@&${dj}>` : "Nothing."}`
        )
    );
  }
}
