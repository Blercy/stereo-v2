import { Inhibitor } from "discord-akairo";
import { Message } from "discord.js";

import { Activator } from "@core";

@Activator("userBlacklist")
export default class UserBlacklistInhibitor extends Inhibitor {
  public exec(message: Message): boolean {
    return this.client.settings
      .get<any[]>(null, "blacklist.users", [])
      .some((data) => data.id === message.author.id);
  }
}
