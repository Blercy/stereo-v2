import { Command, Flag } from "discord-akairo";
import { SettingsCommand } from "@core";

@SettingsCommand("prefix", {
  aliases: ["prefixes", "pfx"],
  description: {
    content: "Configures server prefixes",
    usage: "[?add|rm, remove, del, delete|list, ls|mention|] ...args",
    examples: [
      "add s!!",
      "add 's '",
      "rm s!!",
      "remove 's '",
      "list",
      "mention on",
      "mention off",
    ],
  },
  userPermissions: ["MANAGE_MESSAGES"],
})
export default class PrefixCommand extends Command {
  public *args() {
    const method = yield {
      type: [
        ["prefix-add", "add"],
        ["prefix-delete", "delete", "del", "rm", "remove"],
        ["prefix-list", "list", "ls"],
        ["prefix-mention", "mention"],
      ],
      default: "prefix-list",
    };

    return Flag.continue(method);
  }
}
