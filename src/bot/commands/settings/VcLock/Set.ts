import { Command } from "discord-akairo";
import { Message, MessageEmbed, VoiceChannel } from "discord.js";

import { Sub } from "@core";

@Sub("vclock-set", [
  {
    id: "channel",
    type: "voiceChannel",
    prompt: {
      start: "Please provide a voice channel to join",
      retry: "I don't believe that's a voice channel, try again?",
    },
    match: "content",
  },
])
export default class VcLockCommand extends Command {
  public exec(message: Message, { channel }: { channel: VoiceChannel }) {
    if (
      !channel.joinable ||
      !channel.permissionsFor(message.guild!.me!)!.has(["CONNECT", "SPEAK"])
    )
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(`I cannot access that channel.`)
      );

    if (!channel.permissionsFor(message!.member!)!.has("CONNECT"))
      return message.util?.send(
        new MessageEmbed()
          .setColor("#f55e53")
          .setDescription(
            `You cannot access that channel, why try to set the vc lock to that?`
          )
      );

    this.client.settings.set(message.guild, "vclock", channel.id);

    return message.util?.send(
      new MessageEmbed()
        .setColor("#42f57e")
        .setDescription(`Okay, I am now bound to \`${channel.name}\``)
    );
  }
}
