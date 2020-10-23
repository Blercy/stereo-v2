import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";
import { execSync } from "child_process";

import { PublicCommand } from "@core";

@PublicCommand("speedtest", { description: { content: "Does a speedtest" } })
export default class SpeedtestCommand extends Command {
  public async exec(message: Message) {
    message.channel
      .send("Getting Results...")
      .then((msg) => {
        msg.delete();

        return message.channel.send(
          new MessageEmbed()
            .setColor("#7289DA")
            .setAuthor(
              `The results came in!`,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setDescription(
              execSync(
                `curl -s https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py | python - --simple`
              )
                .toString()
                .replace(config.get("bot.ip") as string, "[redacted]")
            )
        );
      })
      .catch(() => {
        message.channel.send("Hm, speedtest seems to be having a problem.");
      });
  }
}
