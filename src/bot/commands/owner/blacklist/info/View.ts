import { Command, Flag } from "discord-akairo";
import { MessageEmbed } from "discord.js";

import { Sub } from "@core";

@Sub("blacklist-view")
export default class BlacklistCommand extends Command {
  public *args() {
    const method = yield {
      type: [
        ["blacklist-view-user", "user"],
        ["blacklist-view-guild", "guild"],
      ],

      otherwise: (msg: any) => {
        //@ts-expect-error
        const prefix = this.handler.prefix(msg);

        return new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `Invalid usage! Run \`${prefix[0]}help blacklist\` for help.`
          );
      },
    };

    return Flag.continue(method);
  }
}
