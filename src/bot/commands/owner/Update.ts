import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { OwnerCommand } from "@core";
import { execSync } from "child_process";

@OwnerCommand("update", {
  description: {
    content: "Updates the bot's repository",
    usage: "[?message]",
    examples: ["add changes"],
  },
  args: [
    {
      id: "msg",
      match: "content",
      default: (m: Message) =>
        `@${
          m.author.tag
        } - No commit message at ${new Date().toLocaleString()}`,
    },
  ],
})
export default class UpdateCommand extends Command {
  public exec(message: Message, { msg }: { msg: string }) {
    try {
      const returned = execSync(
        `git add . && git commit -m "${msg}" && git push`
      ).toString();

      return message.util?.send(`\`\`\`${returned}\`\`\``);
    } catch (error) {
      return message.util?.send(
        `Error:\`\`\`${error.toString().shorten(1900)}\`\`\``
      );
    }
  }
}
