import { Listener } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { Event } from "@core";

@Event("blocked", { emitter: "commands", event: "commandBlocked" })
export default class BlockedEvent extends Listener {
  public exec(message: Message, _: any, reason: string) {
    switch (reason) {
      case "guild":
        return message.util?.send(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(
              `This command is only allowed to be ran inside a server!`
            )
        );

      case "owner":
        return message.util?.send(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(`Only owners are allowed to run this command!`)
        );

      case "djRole":
        return message.util?.send(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(`Only DJ's can run this command.`)
        );

      case "userBlacklist":
        return message.util?.send(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(
              `You are blacklisted from Stereo! Think this is a mistake? Join [this](${config.get(
                "links.discord"
              )})`
            )
        );

      case "guildBlacklist":
        return message.util?.send(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(
              `Your guild is blacklisted from Stereo! Think this is a mistake? Join [this](${config.get(
                "links.discord"
              )})`
            )
        );
    }
  }
}
