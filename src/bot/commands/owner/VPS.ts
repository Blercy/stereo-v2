import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { OwnerCommand, formatSize } from "@core";

@OwnerCommand("vps", {
  aliases: ["vpsstats", "vpsstatistics"],
  description: { content: "Displays VPS statistics" },
})
export default class VPSCommand extends Command {
  public async exec(message: Message) {
    const data = await this.client.apis.get("vps").stats();

    const { info } = data;

    return message.util?.send(
      new MessageEmbed()
        .setColor("#7289DA")
        .setAuthor(
          `VPS Statistics`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription([
          `**› Bandwidth**`,
          `\`\`\``,
          `Used         : ${info.bandwidth.used_gb}GB`,
          `Percent Used : ${info.bandwidth.percent}%`,
          `Limit        : ${info.bandwidth.limit_gb}GB`,
          `\`\`\``,
          `**› Other Information**`,
          `\`\`\``,
          `OS           : ${info.os.name}`,
          `Type         : ${info.os.type}`,
          `Size         : ${formatSize(Number(info.os.size))}`,
          `Active Since : ${info.show_vps_active_time}`,
          `Hostname     : ${info.hostname}`,
          `\`\`\``,
        ])
    );
  }
}
