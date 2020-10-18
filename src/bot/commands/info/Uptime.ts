import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";

import { PublicCommand, ms } from "@core";

@PublicCommand("uptime", {
  description: { content: "Displays the bots uptime" },
})
export default class UptimeCommand extends Command {
  public exec(message: Message) {
    return message.util?.send(
      new MessageEmbed()
        .setColor("#7289DA")
        .setDescription(`I have been alive for ${ms(this.client.uptime!)}`)
    );
  }
}
