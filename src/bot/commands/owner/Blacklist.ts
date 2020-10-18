import { Command, Flag } from "discord-akairo";
import { MessageEmbed } from "discord.js";

import { OwnerCommand } from "@core";

@OwnerCommand("blacklist", {
  aliases: ["bl"],
  description: {
    content: "Manage blacklists",
    usage:
      "[add|delete, del, rm, remove|list|view, info] [guild|user|view] ...args",
    examples: [
      "add guild 613425648685547541",
      "add user 535585397435006987",
      "delete guild Discord Developers",
      "delete user aesthetical",
      "list guild",
      "list user 2",
      "info user @aesthetical",
      "info guild Stereo",
    ],
  },
})
export default class BlacklistCommand extends Command {
  public *args() {
    const method = yield {
      type: [
        ["blacklist-add", "add"],
        ["blacklist-delete", "delete", "del", "rm", "remove"],
        ["blacklist-list", "list"],
        ["blacklist-view", "view", "info"],
      ],

      otherwise: (msg: any) => {
        //@ts-expect-error
        const prefix = this.handler.prefix(msg);

        return new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `Invalid usage! Run \`${prefix[0]}help ${this.id}\` for help.`
          );
      },
    };

    return Flag.continue(method);
  }
}
