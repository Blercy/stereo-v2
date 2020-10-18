import { Command, Flag } from "discord-akairo";
import { SettingsCommand } from "@core";

@SettingsCommand("vclock", {
  aliases: ["vcl", "voicechannel", "vc", "setvc"],
  description: {
    content: "Sets a voice channel restriction",
    usage: "[?set|remove, rm, del, delete|current]",
    examples: ["", "current", "set Music", "delete"],
  },
  userPermissions: ["MANAGE_CHANNELS"],
})
export default class VcLockCommand extends Command {
  public *args() {
    const method = yield {
      type: [
        ["vclock-set", "set"],
        ["vclock-delete", "delete", "del", "rm", "remove"],
        ["vclock-current", "current"],
      ],
      default: "vclock-current",
    };

    return Flag.continue(method);
  }
}
