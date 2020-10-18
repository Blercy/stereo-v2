import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { Sub } from "@core";

@Sub("vclock-current")
export default class VcLockCommand extends Command {
  public exec(message: Message) {
    const channel: string = this.client.settings.get(message.guild, "vclock");

    return message.util?.send(
      new MessageEmbed()
        .setColor("#7289DA")
        .setDescription(
          channel
            ? `I will join \`${
                message.guild!.channels.cache.get(channel)!.name
              }\` when using the \`play\` or \`join\` commands`
            : "I will join any channel the user joins when using the `play` or `join` commands."
        )
    );
  }
}
