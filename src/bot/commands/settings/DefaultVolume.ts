import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { SettingsCommand } from "@core";

@SettingsCommand("defaultvolume", {
  aliases: ["defaultvol"],
  description: {
    content: "Sets the players default volume",
    usage: "[?volume]",
    examples: ["", "50"],
  },
  args: [
    {
      id: "volume",
      type: "number",
    },
  ],
})
export default class DefaultVolumeCommand extends Command {
  public exec(message: Message, { volume }: { volume: number }) {
    if (!volume || volume > 200 || volume < 1)
      return message.util?.send(
        new MessageEmbed()
          .setColor("#7289DA")
          .setDescription(
            `The default volume is **${this.client.settings.get(
              message.guild,
              "defaultVolume",
              100
            )}/200**`
          )
      );

    this.client.settings.set(message.guild, "defaultVolume", volume);

    const player = this.client.lavalink.players.get(message.guild!.id);
    if (player) player.setVolume(volume);

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(`Okay, I've set the default volume to **${volume}**`)
    );
  }
}
