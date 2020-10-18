import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";

import { PublicCommand } from "@core";
import fetch from "node-fetch";

@PublicCommand("status", {
  description: { content: "Displays the bots status and the discord status" },
})
export default class StatusCommand extends Command {
  public async exec(message: Message) {
    let { components } = await (
      await fetch(`https://srhpyqt94yxb.statuspage.io/api/v2/summary.json`)
    ).json();

    const data = await this.client.shard!.broadcastEval(`this.shard.mode`);
    const ping = this.client.ws.ping;

    const operationalVoiceRegions = components
      .find((data: any) => data.name === "Voice")
      .components.map((id: string) =>
        components.find((res: any) => res.id === id)
      )
      .reduce(
        (prev: any, curr: any) =>
          curr.status === "operational" ? prev + 1 : prev + 0,
        0
      );

    components = components.filter((data: any) =>
      [
        "API",
        "CloudFlare",
        "Media Proxy",
        "US Central",
        "Voice",
        "Europe",
        "Voice",
      ].includes(data.name)
    );

    const longestName = components.sort(
      (a: any, b: any) => b.name.length - a.name.length
    )[0].name.length;

    return message.util?.send(
      new MessageEmbed()
        .setColor("#7289DA")
        .setAuthor(
          `${this.client.user!.username}'s Status`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription([
          `**› Bot Status**`,
          `\`\`\`prolog`,
          `Ping   : ${ping}ms (${ping < 75 ? "Normal" : "High Latency"})`,
          `Shards : ${data.filter((key) => key === "process").length}/${
            this.client.shard!.count
          } Online`,
          `\`\`\``,
          `**› Discord Status**`,
          `\`\`\`prolog`,
          components
            .filter((key: any) => key !== "Voice")
            .map(
              (key: any) =>
                `${key.name.padEnd(
                  longestName * 2 - key.name.length,
                  " \u200b"
                )} : ${key.status.replace(/(\b\w)/gi, (str: string) =>
                  str.toUpperCase()
                )}`
            )
            .join("\n"),
          `${"Voice".padEnd(
            longestName * 2 - "Voice".length,
            " \u200b"
          )} : ${operationalVoiceRegions}/14 Operational`,
          `\`\`\``,
        ])
    );
  }
}
