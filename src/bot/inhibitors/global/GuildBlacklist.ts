import { Inhibitor } from "discord-akairo";
import { Message } from "discord.js";

import { Activator } from "@core";

@Activator("guildBlacklist")
export default class GuildBlacklistInhibitor extends Inhibitor {
  public exec(message: Message): boolean {
    return this.client.settings
      .get<any[]>(null, "blacklist.guilds", [])
      .some((data) => data.id === message.guild!.id);
  }
}
