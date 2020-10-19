import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { PublicCommand } from "@core";

@PublicCommand("privacy", {
  aliases: ["pri"],
  description: {
    content: "Displays Stereo's privacy policy.",
  },
})
export default class PrivacyCommand extends Command {
  public exec(message: Message) {
    return message.util?.send(
      `Here you go: https://github.com/Stereo-Developers/issues/blob/master/PRIVACY-POLICY.md`
    );
  }
}
