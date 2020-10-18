import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";

import { PublicCommand } from "@core";

@PublicCommand("invite", {
  aliases: ["inv"],
  description: { content: "Invites for Stereo" },
})
export default class InviteCommand extends Command {
  public async exec(message: Message) {
    return message.util?.send(
      new MessageEmbed()
        .setColor("#7289DA")
        .setAuthor(
          `Here you go, ${message.author.username}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription([
          `Thank you for showing an interest in Stereo! Here are some invites for you:`,
          `\n**Required Permissions**: [Required Permissions (${config.get(
            "links.permissions"
          )})](https://discord.com/oauth2/authorize?client_id=725808086933176410&permissions=36711424&scope=bot)`,
          `**Administrator Permissions**: [Administrator Permissions (8)](https://discord.com/oauth2/authorize?client_id=725808086933176410&permissions=8&scope=bot)`,
          `**No Permissions**: [No Permissions (0)](https://discord.com/oauth2/authorize?client_id=725808086933176410&permissions=0&scope=bot)`,
        ])
    );
  }
}
