import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { Sub } from "@core";

@Sub("prefix-mention", [
  {
    id: "toggle",
    type: (_, str) => {
      if (!str || !["on", "off"].includes(str.toLowerCase())) return null;

      return str.toLowerCase() === "on" ? true : false;
    },
    prompt: {
      start: "Please provide if you'd like to turn it on or off",
      retry: "You must use `on` or `off` as the toggle.",
    },
  },
])
export default class PrefixCommand extends Command {
  public exec(message: Message, { toggle }: { toggle: boolean }) {
    const { mention, prefixes } = this.client.settings.get(
      message.guild,
      "prefix",
      true
    );
    if (mention === toggle)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `You can't set the mention prefix toggle to that because it's already ${
              toggle ? "on" : "off"
            }`
          )
      );

    if (!prefixes.length && !toggle)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `You cannot turn off the mention prefix because you have no other prefixes to fall back to.`
          )
      );

    this.client.settings.set(message.guild, "prefix.mention", toggle);

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(
          `Okay, I've turned mention prefix ${toggle ? "on" : "off"}`
        )
    );
  }
}
