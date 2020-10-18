import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";
import { execSync } from "child_process";

import { PublicCommand } from "@core";

@PublicCommand("speedtest", { description: { content: "Does a speedtest" } })
export default class SpeedtestCommand extends Command {
  public async exec(message: Message) {
    const msg = await message.channel.send("Getting results...");

    try {
      const data = execSync(
        `curl -s https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py | python -`
      )
        .toString()
        .split("\n")
        .filter(
          (str) => str.startsWith("Download:") || str.startsWith("Upload:")
        );

      msg.delete();

      message.util?.send(
        new MessageEmbed()
          .setColor("#7289DA")
          .setAuthor(
            `The results came in!`,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setDescription([
            `**Upload**: ${data[1].split("Upload: ").join("")}`,
            `**Download**: ${data[0].split("Download: ").join("")}`,
          ])
      );
    } catch (error) {
      return message.channel.send(`Couldn't retrive information`);
    }
  }
}
