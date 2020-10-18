import { Command } from "discord-akairo";
import { Message, MessageEmbed, Role } from "discord.js";

import { Sub } from "@core";

@Sub("dj-set", [
  {
    id: "role",
    type: "role",
    prompt: {
      start: "Please provide a role",
      retry: "I'll need a valid role",
    },
  },
])
export default class DjCommand extends Command {
  public exec(message: Message, { role }: { role: Role }) {
    const current = this.client.settings.get(message.guild, "dj");
    if (current === role.id)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`That is already the DJ role.`)
      );

    this.client.settings.set(message.guild, "dj", role.id);

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(`Set the DJ role to ${role}`)
    );
  }
}
