import { Listener } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { Event } from "@core";
import ms from "@stereobot/ms";

@Event("cooldown", { emitter: "commands", event: "cooldown" })
export default class CooldownEvent extends Listener {
  public exec(message: Message, _: any, remaining: number) {
    return message.util?.send(
      new MessageEmbed()
        .setColor("#f55e53")
        .setDescription(
          `Please wait **${ms(remaining)}** until using that command again.`
        )
    );
  }
}
