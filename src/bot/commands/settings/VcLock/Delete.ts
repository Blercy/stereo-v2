import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { Sub } from "@core";

@Sub("vclock-delete")
export default class VcLockCommand extends Command {
  public exec(message: Message) {
    this.client.settings.delete(message.guild, "vclock");

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(
          "Okay, I've deleted the voice channel lock restrictions"
        )
    );
  }
}
