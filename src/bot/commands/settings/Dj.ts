import { Command, Flag } from "discord-akairo";

import { SettingsCommand } from "@core";

@SettingsCommand("dj", {
  aliases: ["djrole"],
  description: {
    content: "Configures the DJ role",
    usage: "[?set|del, delete, remove, rm|current] ...args",
    examples: ["", "set @DJ", "del", "current"],
  },
  userPermissions: ["MANAGE_ROLES"],
})
export default class DjCommand extends Command {
  public *args() {
    const method = yield {
      type: [
        ["dj-set", "set"],
        ["dj-delete", "delete", "del", "rm", "remove"],
        ["dj-current", "current"],
      ],
      default: "dj-current",
    };

    return Flag.continue(method);
  }
}
