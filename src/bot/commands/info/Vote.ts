import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";

import { PublicCommand } from "@core";

@PublicCommand("vote", {
  aliases: ["voted"],
  description: {
    content:
      "Checks if you have voted for stereo on [top.gg](https://top.gg/bot/725808086933176410)",
  },
})
export default class VoteCommand extends Command {
  public async exec(message: Message) {
    const voted = this.client.apis.get("dbl").voted(message.author.id);

    return message.util?.send(
      new MessageEmbed()
        .setColor("#7289DA")
        .setDescription([
          `You have ${voted ? "" : "not"} voted for Stereo on top.gg.`,
          voted
            ? ""
            : "However if you would like to vote, you may do that [here](https://top.gg/bot/725808086933176410/vote)",
        ])
    );
  }
}
