import { Inhibitor, Command } from "discord-akairo";
import { Message } from "discord.js";

import { Activator } from "@core";

@Activator("djRole")
export default class DjRoleInhibitor extends Inhibitor {
  public exec(message: Message, cmd: Command): boolean {
    const role = this.client.settings.get(message.guild!.id, "dj");

    return (
      role &&
      !message.member?.roles.cache.has(role as string) &&
      cmd.categoryID === "music" &&
      !["play", "nowplaying", "queue", "radio", "join"].includes(cmd.id) &&
      (!message.member?.permissions.has("ADMINISTRATOR", true) ||
        message.member?.voice.channel?.members.filter((m) => !m.user.bot)
          .size === 2)
    );
  }
}
