import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { SettingsCommand } from "@core";

@SettingsCommand("announcenext", {
  aliases: ["announce"],
  description: {
    content: "Turns announce next track on or off",
    usage: "[?toggle]",
    examples: ["", "on", "off"],
  },
  args: [
    {
      id: "toggle",
      type: (_, str) =>
        ["on", "off"].includes(str.toLowerCase()) ? str.toLowerCase() : null,
    },
  ],
})
export default class AnnounceNextCommand extends Command {
  public exec(message: Message, { toggle }: { toggle: string }) {
    const announceNext = this.client.settings.get(
      message.guild,
      "announceNext",
      true
    );

    if (!toggle)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#7289DA")
          .setDescription(
            `You are ${
              announceNext ? "" : "not"
            } announcing next track messages.`
          )
      );

    const type = toggle.toLowerCase() === "on" ? true : false;

    if (announceNext === type)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `Announce next messages are already ${type ? "on" : "off"}`
          )
      );

    this.client.settings.set(message.guild, "announceNext", type);

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(
          `Okay, I've turned announce next track messages ${
            type ? "on" : "off"
          }`
        )
    );
  }
}
