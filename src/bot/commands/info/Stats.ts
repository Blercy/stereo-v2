import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";

import { PublicCommand, formatSize, ms } from "@core";
import { getHeapStatistics } from "v8";
import { execSync } from "child_process";
import { cpus as cpuS, totalmem, hostname, userInfo, arch } from "os";

@PublicCommand("stats", {
  aliases: ["statistics"],
  description: { content: "Displays some general statistics" },
})
export default class StatsCommand extends Command {
  public async exec(message: Message) {
    const cpus = cpuS();

    const { used_heap_size } = getHeapStatistics();

    return message.util?.send(
      new MessageEmbed()
        .setColor("#7289DA")
        .setAuthor(
          `${this.client.user!.username}'s Stats (${execSync(
            "git rev-parse HEAD"
          )
            .toString()
            .slice(0, 7)})`,
          message.author.displayAvatarURL({ dynamic: true }),
          `https://github.com/Stereo-Developers/stereo/commit/${execSync(
            "git rev-parse HEAD"
          ).toString()}`
        )
        .setDescription([
          `**› CPU Information**:`,
          `\`\`\``,
          `${cpus[0].model}\n`,
          cpus
            .map(
              (data: any, i: number) =>
                `${i + 1} [${this.progress(data.times.sys / 1000000, 100)}] ${(
                  data.times.sys / 1000000
                ).toFixed(2)}%`
            )
            .join("\n"),
          `\`\`\``,
          `**› Memory Information**:`,
          `\`\`\``,
          `Toal Memory      : ${formatSize(totalmem())}`,
          `Memory Usage     : ${formatSize(used_heap_size)}/${formatSize(
            totalmem()
          )}`,
          `\`\`\``,
          `**› System Information**:`,
          `\`\`\``,
          `OS Release       : ${execSync(`cat /etc/issue`)
            .toString()
            .escapeMarkdown()}`,
          `Uptime           : ${ms(process.uptime())
            .replace(/\*/g, "")
            .trim()}`,
          `Arch             : ${arch()}`,
          `Hostname         : ${userInfo().username}@${hostname()}`,
          `Bot Version      : v${require("../../../../package.json").version}`,
          `\`\`\``,
        ])
        .addField(
          `› Commits`,
          this.getCommits()
            .map(
              (data) =>
                `[\`${data.hash?.slice(
                  0,
                  7
                )}\`](https://github.com/Stereo-Developers/stereo/commit/${
                  data.hash
                }) ${data.subject.substring(
                  0,
                  45
                )} - [**@${data.commiter?.toLowerCase()}**](https://github.com/${
                  data.commiter
                })`
            )
            .join("\n")
            .substring(0, 1020)
        )
    );
  }

  public progress(amount: number, total: number) {
    return (
      "|".repeat(Math.floor((amount / Number(total)) * 20)) +
      "" +
      " ".repeat(20 - Math.floor((amount / Number(total)) * 20))
    );
  }

  // lowkey stole from https://github.com/KyuDiscord/blade/blob/rewrite/src/util/ProjectInfo.ts#L84#L99 thanks 2D
  public getCommits() {
    return execSync("git log --pretty=format:'%H %s %cn' -n 5")
      .toString()
      .trim()
      .split("\n")
      .map((s) => s.trim().split(" "))
      .map((c) => ({
        hash: c.shift(),
        commiter: c.pop(),
        subject: c.join(" "),
      }));
  }
}
