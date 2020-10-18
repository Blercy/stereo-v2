import { Command, Flag } from "discord-akairo";
import { MessageEmbed } from "discord.js";

import { PublicCommand } from "@core";

@PublicCommand("playlists", {
  aliases: ["playlist", "pl"],
  description: {
    content: "Manages playlists",
    usage:
      "[?create|add|remove, rm, delete, del|clone, copy|list, ls, all|view, info, information]",
    examples: [
      "create TikTok Songs that are good because I say so",
      "create xd -private",
      "add song Josh A - Used To",
      "remove track Josh A - Used To",
      "add collaborator @aesthetical",
      "remove collab @aesthetical",
      "remove playlist xd",
      "clone 174ef723-e643-df7b-b268-b3fd8eea5b2d",
      "list",
      "view 174ef723-e643-df7b-b268-b3fd8eea5b2d",
      "info TikTok Songs",
    ],
  },
})
export default class PlaylistsCommand extends Command {
  public *args() {
    const method = yield {
      type: [
        ["playlists-create", "create"],
        ["playlists-add", "add"],
        ["playlists-remove", "remove", "delete", "del", "rm"],
        ["playlists-clone", "clone", "copy"],
        ["playlists-list", "list", "ls", "all"],
        ["playlsts-view", "view", "info", "information"],
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
