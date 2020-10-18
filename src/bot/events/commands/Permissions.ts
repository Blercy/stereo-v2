import { Listener } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { Event } from "@core";

@Event("permissons", { emitter: "commands", event: "missingPermissions" })
export default class Permissions extends Listener {
  public exec(message: Message, _: any, type: "client" | "user", missing: any) {
    switch (type) {
      case "client":
        return message.util?.send(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(
              `I am missing the permission${
                missing.length > 1 ? "s" : ""
              }: ${this.format(message.guild?.me, missing)}`
            )
        );

      case "user":
        return message.util?.send(
          new MessageEmbed()
            .setColor("#f55e53")
            .setDescription(
              `You are missing the permission${
                missing.length > 1 ? "s" : ""
              }: ${this.format(message.member, missing)}`
            )
        );
    }
  }

  public format(member: any, permissions: any[]) {
    const result = member.permissions.missing(permissions).map(
      (str: string) =>
        `**${str
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b(\w)/g, (char) => char.toUpperCase())}**`
    );

    return result.length > 1
      ? `${result.slice(0, -1).join(", ")} and ${result.slice(-1)[0]}`
      : result[0];
  }
}
