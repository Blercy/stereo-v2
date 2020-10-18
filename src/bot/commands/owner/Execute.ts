import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { OwnerCommand } from "@core";
import { execSync } from "child_process";

@OwnerCommand("execute", {
  aliases: ["exec"],
  description: {
    content: "Executes commands as if you were in a terminal",
    usage: "[command]",
    examples: ["ls", "pm2 ls"],
  },
  args: [
    {
      id: "cmd",
      match: "content",
      prompt: {
        start: "Please provide a command to run",
      },
    },
  ],
})
export default class ExecuteCommand extends Command {
  public exec(message: Message, { cmd }: { cmd: string }) {
    try {
      let hr = process.hrtime();
      const data = execSync(cmd).toString();
      hr = process.hrtime(hr);

      return message.util?.send([
        `⏱️ Took: ${hr[0] > 0 ? `${hr[0]}s ` : ""}${hr[1] / 1000000}ms`,
        `\`\`\`bash\n${data.substring(0, 1950)}\`\`\``,
      ]);
    } catch (error) {
      return message.util?.send(
        `Whoopies, there was an error.\n\`\`\`bash\n${error}\`\`\``
      );
    }
  }
}
